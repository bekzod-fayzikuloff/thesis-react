import { IComment, IPost } from '../../types';
import style from './PostDetail.module.scss';
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from 'react';
import { createComment } from '../../services/posts';
import { getResponse } from '../../services/utils/sendRequest';
import { API_URL } from '../../config';
import defaultUserLogo from '../../assets/images/default_user.jpg';
import { useNavigate } from 'react-router-dom';

function CommentItem(props: { comment: IComment }) {
  const { comment } = props;
  const navigate = useNavigate();

  return (
    <div className={style.comment__block}>
      <div className={style.comment__avatar}>
        <img
          onClick={() => navigate(`/profile/${comment.creatorId}`)}
          src={comment.avatar ? API_URL?.concat(comment.avatar) : defaultUserLogo}
          alt="comment creator"
        />
      </div>
      <div className={style.comment__main}>
        <span onClick={() => navigate(`/profile/${comment.creatorId}`)}>{comment.username}</span>
        <p>{comment.content}</p>
      </div>
    </div>
  );
}

export function SendComment(props: any) {
  return (
    <div style={props.style && props.style} className={style.comment__content}>
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

export default function PostDetail(props: { post: IPost | null }) {
  const [commentText, setCommentText] = useState('');

  const [postDetailed, setPostDetailed] = useState<null | IPost>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentQuantity, setCommentQuantity] = useState<undefined | number>(undefined);

  useEffect(() => {
    getResponse(
      `${API_URL}/api/posts/${props.post?.id}/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      setPostDetailed(response.data);
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
    if (commentText === '') {
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
          <p>{postDetailed?.creatorUsername}</p>
        </div>
        <div className={style.post__desc_text}>
          <p>{postDetailed?.description}</p>
        </div>
        <div className={style.comments}>
          {comments.map((c: IComment) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>
        <div className={style.post__action}>
          <p>comments {commentQuantity} </p>
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
