import { useNavigate, useParams } from 'react-router-dom';
import style from './PostDetail.module.scss';
import React, { useEffect, useState } from 'react';
import { IComment, IFeedPost } from '../../types';
import { getResponse, sendDataAuthRequire } from '../../services/utils/sendRequest';
import { API_URL } from '../../config';
import defaultUserLogo from '../../assets/images/default_user.jpg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RedoIcon from '@mui/icons-material/Redo';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { CommentItem, SendComment } from '../../components/PostDetail';
import axios from 'axios';
import { createComment } from '../../services/posts';
import jwt_decode from 'jwt-decode';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

export const PostDetail = () => {
  const { postId } = useParams();
  const [commentText, setCommentText] = useState('');
  const [commentQuantity, setCommentQuantity] = useState<undefined | number>(undefined);
  const [isSaved, setSaved] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentLikeId, setCurrentLikeId] = useState();

  const [postDetailed, setPostDetailed] = useState<null | IFeedPost>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const { user_id }: { user_id: number } = jwt_decode(localStorage.getItem('authToken') as string);
  const navigate = useNavigate();

  const likePost = () => {
    setLikeCount((prevS) => prevS + 1);
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

  const addBookmark = () => {
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
    setSaved(true);
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

  console.log('postDetail', postDetailed);

  useEffect(() => {
    getResponse(
      `${API_URL}/api/posts/${postId}/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      setLiked(response.data.postIsLiked);
      setSaved(response.data.postIsSaved);
      setLikeCount(response.data.likes);
      setCurrentLikeId(response.data.postLikeId);
      setCommentQuantity(response.data.commentsQuantity);
      setPostDetailed(response.data);
    });

    getResponse(
      `${API_URL}/api/comments/?post_id=${postId}`,
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
    createComment(postDetailed?.id, commentText)
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
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.image__container}>
            <img src={postDetailed?.medias[0]?.file} referrerPolicy="no-referrer" alt="" />
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
                <RedoIcon />

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
      </div>
    </div>
  );
};
