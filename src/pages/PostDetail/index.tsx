import {useNavigate, useParams} from "react-router-dom";
import style from "./PostDetail.module.scss";
import React, {useEffect, useState} from "react";
import {IFeedPost} from "../../types";
import {getResponse} from "../../services/utils/sendRequest";
import {API_URL} from "../../config";
import defaultUserLogo from "../../assets/images/default_user.jpg";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RedoIcon from "@mui/icons-material/Redo";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {SendComment} from "../../components/PostDetail";

export const PostDetail = () => {
  const {postId} = useParams();
  const [postDetailed, setPostDetailed] = useState<null | IFeedPost>(null);
  // const {user_id}: { user_id: number } = jwt_decode(localStorage.getItem('authToken') as string);
  const navigate = useNavigate();

  console.log('postDetail', postDetailed);

  useEffect(() => {
    getResponse(
      `${API_URL}/api/posts/${postId}/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      setPostDetailed(response.data);
    });

  }, []);


  return (
    <div className={style.root}>
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.image__container}>
            <img src={postDetailed?.medias[0]?.file}
                 referrerPolicy="no-referrer"
                 alt=""/>
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
              <p
                onClick={() => navigate(`/profile/${postDetailed?.creatorId}`)}>
                {postDetailed?.creatorUsername}
              </p>
            </div>
            <div className={style.post__desc_text}>
              <p>{postDetailed?.description}</p>
            </div>
            {/*<div className={style.comments}>*/}
            {/*  <p className={style.comment__count}>comments:{commentQuantity} </p>*/}
            {/*  {comments.map((c: IComment) => (*/}
            {/*    <CommentItem key={c.id} comment={c} />*/}
            {/*  ))}*/}
            {/*</div>*/}
            <div className={style.post__action}>
              <div className={style.actions__items}>
                <FavoriteIcon
                  style={{
                    filter:
                      'invert(9%) sepia(98%) saturate(6010%) hue-rotate(2deg) brightness(98%) contrast(112%)'
                  }}
                />
                )
                <RedoIcon/>

                <BookmarkIcon/>
              </div>
              <SendComment
                style={{paddingRight: '1pt'}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
