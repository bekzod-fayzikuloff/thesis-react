import style from './Feed.module.scss';
import { useEffect, useState } from 'react';
import { getResponse } from '../../services/utils/sendRequest';
import { API_URL } from '../../config';
import jwt_decode from 'jwt-decode';
import { IFeedPost } from '../../types';
import defaultUserLogo from '../../assets/images/default_user.jpg';
import { useNavigate } from 'react-router-dom';

const FeedItem = ({ feedPost }: { feedPost: IFeedPost }) => {
  const navigate = useNavigate();
  return (
    <div className={style.feed__item}>
      <div className={style.feed__headline}>
        <div className={style.container}>
          <img
            onClick={() => navigate(`/profile/${feedPost.creatorId}`)}
            src={feedPost.creatorAvatar ? API_URL?.concat(feedPost.creatorAvatar) : defaultUserLogo}
            alt=""
          />
          <p onClick={() => navigate(`/profile/${feedPost.creatorId}`)}>
            {feedPost.creatorUsername}
          </p>
        </div>
      </div>

      <div className={style.feed__media}>
        <img src={feedPost.medias[0].file} alt="" />
      </div>
      <div className={style.post_reaction}>
        <div className={style.reaction}>
          <span>1</span>
          <span>2</span>
        </div>
        <div className={style.send}>
          <p>3</p>
        </div>
      </div>
      <p>likes: {111}</p>
      <p>
        {feedPost.creatorUsername}: {feedPost.description}
      </p>
      <p>Comments: {111}</p>
      <div className={style.comment__content}>
        <input type={'text'} />
        <input type={'submit'} />
      </div>
    </div>
  );
};

const FeedItems = ({ feeds }: { feeds: IFeedPost[] }) => {
  return (
    <div className={style.grid__root}>
      <div className={style.grid}>
        {feeds.map((feed) => (
          <FeedItem feedPost={feed} key={feed.id} />
        ))}
      </div>
    </div>
  );
};

export function FeedPage() {
  const [feeds, setFeeds] = useState<IFeedPost[]>([]);
  const { user_id }: { user_id: number } = jwt_decode(localStorage.getItem('authToken') as string);
  useEffect(() => {
    getResponse(
      `${API_URL}/api/profiles/${user_id}/feed/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    )
      .then((response) => {
        console.log(response.data);
        setFeeds(response.data);
      })
      .catch();
  }, []);
  return (
    <div className={style.root}>
      <h1>Feed Page</h1>
      <FeedItems feeds={feeds} />
    </div>
  );
}
