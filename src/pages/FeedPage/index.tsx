import style from './Feed.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { getResponse } from '../../services/utils/sendRequest';
import { API_URL } from '../../config';
import jwt_decode from 'jwt-decode';
import { IFeedPost } from '../../types';
import defaultUserLogo from '../../assets/images/default_user.jpg';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RedoIcon from '@mui/icons-material/Redo';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from 'axios';

const FeedItem = ({ feedPost }: { feedPost: IFeedPost }) => {
  const [commentText, setCommentText] = useState('');
  const [likesQuantity, setLikesQuantity] = useState(feedPost.likes);
  const [isLiked, setIsLiked] = useState(feedPost.postIsLiked);
  const [isSaved, setIsSaved] = useState(feedPost.postIsSaved);
  const [commentQuantity, setCommentQuantity] = useState(feedPost.commentsQuantity);
  const [recentComments, setRecentComments] = useState<string[]>([]);
  const { username }: { username: string } = jwt_decode(
    localStorage.getItem('authToken') as string
  );
  console.log(username);
  const navigate = useNavigate();

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCommentText((e.target as HTMLInputElement).value);
  };

  const handleLikeSubmit = () => {
    setLikesQuantity((prevState) => prevState + 1);
    setIsLiked(true);
  };

  const handleUnlikeSubmit = () => {
    setLikesQuantity((prevState) => prevState - 1);
    setIsLiked(false);
  };

  const addBookmark = () => {
    alert('add');
    setIsSaved(true);
  };

  const removeBookmark = () => {
    alert(feedPost.postIsSavedGroups[0]);
    setIsSaved(false);
  };

  const handleCommentSubmit = () => {
    if (commentText === '') {
      return;
    }
    axios
      .post(
        `${API_URL}/api/comments/`,
        {
          post: feedPost.id,
          content: commentText
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem('authToken') as string).access
            }`
          }
        }
      )
      .then((r) => console.log(r))
      .catch();
    setRecentComments((prevState) => [...prevState, commentText]);
    setCommentText('');
    setCommentQuantity((prevState) => prevState + 1);
  };

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
          {isLiked ? (
            <FavoriteIcon
              style={{
                filter:
                  'invert(9%) sepia(98%) saturate(6010%) hue-rotate(2deg) brightness(98%) contrast(112%)'
              }}
              onClick={handleUnlikeSubmit}
            />
          ) : (
            <FavoriteBorderIcon onClick={handleLikeSubmit} />
          )}
          <ChatBubbleOutlineIcon onClick={() => navigate(`/p/${feedPost.id}`)} />
          <RedoIcon />
        </div>
        <div className={style.bookmark}>
          {isSaved ? (
            <BookmarkIcon onClick={removeBookmark} />
          ) : (
            <BookmarkBorderIcon onClick={addBookmark} />
          )}
        </div>
      </div>
      <p>likes: {likesQuantity}</p>
      <p>
        {feedPost.creatorUsername}: {feedPost.description}
      </p>
      <p>Comments: {commentQuantity}</p>
      {recentComments.map((comment, key) => (
        <p key={key}>
          {username}: {comment}
        </p>
      ))}
      <div className={style.comment__content}>
        <input
          placeholder={'Добавьте комментарий...'}
          value={commentText}
          onChange={handleChange}
          type={'text'}
        />
        <SendIcon
          style={
            commentText
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
          onClick={handleCommentSubmit}
        />
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

const FriendsList = ({ userId }: { userId: number }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const moveSlider = (scrollDur: number) => {
    console.log(scrollRef);
    scrollRef.current?.scrollBy(scrollDur, 0);
  };
  const friends = [
    { id: 1, username: '1' },
    { id: 2, username: '2' },
    { id: 3, username: '3' },
    { id: 4, username: '4' },
    { id: 5, username: '5' },
    { id: 6, username: '6' },
    { id: 7, username: '7' },
    { id: 8, username: '8' },
    { id: 9, username: '9' },
    { id: 10, username: '10' },
    { id: 11, username: '11' },
    { id: 12, username: '12' },
    { id: 13, username: '13' },
    { id: 14, username: '14' },
    { id: 15, username: '15' },
    { id: 16, username: '16' },
    { id: 17, username: '17' },
    { id: 18, username: '18' }
  ];
  console.log('User Friends ', userId);
  return (
    <div className={style.friend__list}>
      <div ref={scrollRef} className={style.wrapper}>
        {friends.map((friend) => {
          return (
            <div className={style.story} key={friend.id}>
              {friend.username}
            </div>
          );
        })}
        <p className={style.left} onClick={() => moveSlider(-200)}>
          ⟸
        </p>
        <p className={style.right} onClick={() => moveSlider(200)}>
          ⟹
        </p>
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
      <FriendsList userId={user_id} />
      <FeedItems feeds={feeds} />
    </div>
  );
}
