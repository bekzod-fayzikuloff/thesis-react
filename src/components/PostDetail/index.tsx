import { IComment, IFeedPost } from '../../types';
import style from './PostDetail.module.scss';
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from 'react';
import { createComment } from '../../services/posts';
import { getResponse, sendDataAuthRequire } from '../../services/utils/sendRequest';
import { API_URL } from '../../config';
import defaultUserLogo from '../../assets/images/default_user.jpg';
import { useNavigate } from 'react-router-dom';
import RedoIcon from '@mui/icons-material/Redo';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { toRepresent } from '../../services/utils/date';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Modal from '../../common/ui/Modal';
import useModal from '../../hooks/useModal';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

function CommentItem(props: { comment: IComment }) {
  const { comment } = props;
  const navigate = useNavigate();
  const [action, setAction] = useState(false);
  const { isOpen: commentActionIsOpen, toggle: commentActionToggle } = useModal();

  const dateDiff = (date1: Date, date2: Date) => {
    // @ts-ignore
    return toRepresent(Math.abs((date1 - date2) / 1000));
  };

  return (
    <>
      <Modal
        childClassName={style.action__modal}
        className={style.resend__modal}
        isOpen={commentActionIsOpen}
        toggle={commentActionToggle}
      >
        <p>Пожаловаться</p>
        <p onClick={commentActionToggle}>Отменить</p>
      </Modal>
      <div className={style.comment__block}>
        <div className={style.comment__avatar}>
          <img
            onClick={() => navigate(`/profile/${comment.creatorId}`)}
            src={comment.avatar ? API_URL?.concat(comment.avatar) : defaultUserLogo}
            alt="comment creator"
          />
        </div>
        <div
          onMouseEnter={() => setAction(true)}
          onMouseLeave={() => setAction(false)}
          className={style.comment__main}
        >
          <span onClick={() => navigate(`/profile/${comment.creatorId}`)}>{comment.username}</span>
          <p>{comment.content}</p>
          <p className={style.comment__created}>
            {dateDiff(new Date(), new Date(comment.createdAt))}
            {/*<span className={style.comment__reply}>*/}
            {/*  Ответить*/}
            {/*</span> // TODO: Add answer to comments*/}
            <span className={style.comment__edited}>
              {comment.createdAt !== comment.updatedAt && 'edited'}
            </span>
            {action && (
              <span onClick={commentActionToggle} className={style.comment__action}>
                ...
              </span>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export function SendComment(props: any) {
  return (
    <div
      style={props.style && props.style}
      className={`${style.comment__content} ${props.className}`}
    >
      <input
        placeholder={'Добавьте комментарий...'}
        value={props.commentText}
        onChange={props.handleChange}
        type={'text'}
      />
      <SendIcon
        style={
          props.commentText
            ? {
                filter:
                  'invert(43%) sepia(63%) saturate(561%) hue-rotate(171deg) brightness(93%) contrast(90%)',
                cursor: 'pointer'
              }
            : {
                filter:
                  'invert(90%) sepia(4%) saturate(7%) hue-rotate(331deg) brightness(97%) contrast(76%)'
              }
        }
        onClick={props.handleCommentSubmit}
      />
    </div>
  );
}

export default function PostDetail(props: { post: IFeedPost | null }) {
  const [commentText, setCommentText] = useState('');

  const [postDetailed, setPostDetailed] = useState<null | IFeedPost>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentQuantity, setCommentQuantity] = useState<undefined | number>(undefined);
  const [isSaved, setSaved] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentLikeId, setCurrentLikeId] = useState();
  const { isOpen: resendOpen, toggle: resendToggle } = useModal();
  const { user_id }: { user_id: number } = jwt_decode(localStorage.getItem('authToken') as string);
  const navigate = useNavigate();

  console.log('postDetail', postDetailed);

  const removeLikePost = () => {
    setLikeCount((prevState) => prevState - 1);
    sendDataAuthRequire(
      'DELETE',
      `${API_URL}/api/reactions/${currentLikeId}/`,
      {},
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then();
    setLiked(false);
  };

  const likePost = () => {
    setLikeCount((prevState) => prevState + 1);
    axios
      .post(
        `${API_URL}/api/reactions/`,
        { creator: user_id, post: postDetailed?.id, isActive: true },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem('authToken') as string).access
            }`
          }
        }
      )
      .then((r) => {
        setCurrentLikeId(r.data.id);
      });
    setLiked(true);
  };

  const addBookmark = () => {
    setSaved(true);
    axios
      .patch(
        `${API_URL}/api/posts-groups/${postDetailed?.postSavedGroupId}/`,
        { creator: user_id, posts: [postDetailed?.id] },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem('authToken') as string).access
            }`
          }
        }
      )
      .then((r) => console.log(r));
  };

  const removeBookmark = () => {
    setSaved(false);
    axios
      .delete(
        `${API_URL}/api/posts-groups/${postDetailed?.postSavedGroupId}/posts-remove/${postDetailed?.id}/`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem('authToken') as string).access
            }`
          }
        }
      )
      .then((r) => console.log(r));
  };

  useEffect(() => {
    getResponse(
      `${API_URL}/api/posts/${props.post?.id}/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      setPostDetailed(response.data);
      setLiked(response.data.postIsLiked);
      setSaved(response.data.postIsSaved);
      setLikeCount(response.data.likes);
      setCurrentLikeId(response.data.postLikeId);
      setCommentQuantity(response.data.commentsQuantity);
    });

    getResponse(
      `${API_URL}/api/comments/?post_id=${props.post?.id}`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      setComments(response.data.results);
    });
  }, []);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCommentText((e.target as HTMLInputElement).value);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() === '') {
      return;
    }
    createComment(props.post?.id, commentText)
      .then((r) => {
        // @ts-ignore
        setComments((prevState) => [r.data, ...prevState]);
      })
      .catch();
    setCommentText('');

    // @ts-ignore
    setCommentQuantity((prevState) => prevState + 1);
  };
  return (
    <div className={style.root}>
      <div className={style.image__container}>
        <img src={props.post?.medias[0]?.file} referrerPolicy="no-referrer" alt="" />
      </div>
      <div className={style.post__desc}>
        <div className={style.headline}>
          <div className={style.comment__avatar}>
            <img
              onClick={() => navigate(`/profile/${postDetailed?.creatorId}`)}
              src={
                postDetailed?.creatorAvatar
                  ? API_URL?.concat(postDetailed?.creatorAvatar)
                  : defaultUserLogo
              }
              alt="post creator"
            />
          </div>
          <p onClick={() => navigate(`/profile/${postDetailed?.creatorId}`)}>
            {postDetailed?.creatorUsername}
          </p>
        </div>
        <div className={style.post__desc_text}>
          <p>{postDetailed?.description}</p>
        </div>
        <div className={style.comments}>
          <p className={style.comment__count}>comments:{commentQuantity} </p>
          {comments.map((c: IComment) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>
        <div className={style.post__action}>
          <div className={style.actions__items}>
            {isLiked ? (
              <FavoriteIcon
                onClick={() => removeLikePost()}
                style={{
                  filter:
                    'invert(9%) sepia(98%) saturate(6010%) hue-rotate(2deg) brightness(98%) contrast(112%)'
                }}
              />
            ) : (
              <FavoriteBorderIcon onClick={() => likePost()} />
            )}
            <RedoIcon onClick={resendToggle} />
            <Modal
              childClassName={style.model__inner}
              className={style.resend__modal}
              isOpen={resendOpen}
              toggle={resendToggle}
            >
              <h1>Resend</h1>
            </Modal>

            {isSaved ? (
              <BookmarkIcon onClick={() => removeBookmark()} />
            ) : (
              <BookmarkBorderIcon onClick={() => addBookmark()} />
            )}
            <p className={style.likes__count}>Отметок &quot;Нравится&quot; {likeCount}</p>
          </div>
          <SendComment
            style={{ paddingRight: '1pt' }}
            commentText={commentText}
            handleChange={handleChange}
            handleCommentSubmit={handleCommentSubmit}
          />
        </div>
      </div>
    </div>
  );
}
