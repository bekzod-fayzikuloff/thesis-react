import style from './Profile.module.scss';
import defaultUserLogo from '../../assets/images/default_user.jpg';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../common/ui/Modal';
import useModal from '../../hooks/useModal';
import { CSSProperties, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getResponse, sendDataAuthRequire } from '../../services/utils/sendRequest';
import { API_URL } from '../../config';
import jwt_decode from 'jwt-decode';
import { InfinitySpin } from 'react-loader-spinner';
import { UtilsContext } from '../../context/UtilsProvider';
import axios from 'axios';
import { IFeedPost, IFollower, IUserProfile } from '../../types';
import PostDetail from '../../components/PostDetail';

const deleteFollower = (followerId: number) => {
  sendDataAuthRequire(
    'DELETE',
    `${API_URL}/api/followers/${followerId}/`,
    {},
    JSON.parse(localStorage.getItem('authToken') as string).access
  )
    .then()
    .catch((e) => {
      console.log(e);
    });
};

const PagePrivate = () => {
  return (
    <div className={`${style.private__box}`}>
      <div>
        <p>Это закрытый аккаунт Подпишитесь, чтобы видеть его/ее фото и видео.</p>
      </div>
    </div>
  );
};

export const FollowerItem = (props: {
  followerItem: IFollower;
  onRemove: () => void;
  onClose: () => void;
}) => {
  const { changeFollowersState } = useContext(UtilsContext);
  const { userId } = useParams();
  const { user_id }: { user_id: number } = jwt_decode(localStorage.getItem('authToken') as string);
  const navigate = useNavigate();

  return (
    <div className={style.follower__item}>
      <div>
        <img
          onClick={() => {
            props.onClose();
            navigate(`/profile/${props.followerItem.follower.id}`);
          }}
          style={{
            margin: '4pt',
            width: '36px',
            height: '36px',
            borderRadius: '50%'
          }}
          src={
            props.followerItem.follower.avatar
              ? API_URL?.concat(props.followerItem.follower.avatar)
              : defaultUserLogo
          }
          alt=""
        />
      </div>
      <p>
        <span
          onClick={() => {
            props.onClose();
            navigate(`/profile/${props.followerItem.follower.id}`);
          }}
        >
          {props.followerItem.follower.username}
        </span>
      </p>
      {user_id === Number(userId) && (
        <div>
          <span
            onClick={() => {
              props.onRemove();
              changeFollowersState();
            }}
          >
            unfollow
          </span>
        </div>
      )}
    </div>
  );
};

const FollowersItems = ({
  followed,
  setFollowed,
  onClose
}: {
  followed: IFollower[];
  setFollowed: any;
  onClose: () => void;
}) => {
  const onRemove = (id: number) => {
    deleteFollower(id);
    setFollowed((prevState: { filter: (p: (follower: IFollower) => boolean) => any }) => {
      return prevState.filter((follower) => follower.id !== id);
    });
  };

  return (
    <div className={style.followers_listbox}>
      {followed.map((followedItem) => (
        <FollowerItem
          key={followedItem.id}
          onClose={onClose}
          onRemove={() => onRemove(followedItem.id)}
          followerItem={followedItem}
        />
      ))}
    </div>
  );
};

const PostContainer = (props: { navigate: any }) => {
  const [posts, setPosts] = useState<IFeedPost[]>([]);
  const { isOpen: postIsOpen, toggle: postToggle } = useModal();
  const [currentPost, setCurrentPost] = useState<null | IFeedPost>(null);

  const { userId } = useParams();
  useEffect(() => {
    getResponse(
      `${API_URL}/api/posts/?created_by=${userId}`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      setPosts(response.data.results);
    });
  }, [props.navigate]);

  const handlePost = (post: IFeedPost) => {
    setCurrentPost(post);
    postToggle();
  };

  return (
    <>
      <div className={style.grid__wrapper}>
        <div className={style.grid}>
          {posts.map((post: IFeedPost) => {
            return (
              <div key={post?.id}>
                <img
                  onClick={() => handlePost(post)}
                  src={post?.medias[0]?.file}
                  referrerPolicy="no-referrer"
                  alt=""
                />
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        className={style.inbox__modal}
        style={{ width: '75%', height: '75%', padding: 0 }}
        isOpen={postIsOpen}
        toggle={postToggle}
      >
        <PostDetail post={currentPost} />
      </Modal>
    </>
  );
};

const EditItem = (props: {
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  text?: string;
}) => {
  return (
    <div onClick={props.onClick} className={`${style.edit__item} ${props.className}`}>
      {props.text ? <p>{props.text}</p> : props.children}
    </div>
  );
};

const ModalClose = (props: { onClose: () => void; headlineText: string }) => {
  return (
    <div className={style.modal__close}>
      <div className={style.modal__headline}>
        <p>{props.headlineText}</p>
      </div>
      <div onClick={props.onClose} className={style.model__close_btn}>
        <span>&#10005;</span>
      </div>
    </div>
  );
};

function PrivateFollower() {
  return (
    <p style={{ textAlign: 'center', margin: '4pt' }}>Закрытый аккаунт вам нужно подписаться</p>
  );
}

export function ProfilePage() {
  const { logoutUser } = useContext(AuthContext);
  const { isFollowerDelete } = useContext(UtilsContext);
  const [followers, setFollowers] = useState<IFollower[]>([]);
  const [currentUserFollowers, setCurrentUserFollowers] = useState<IFollower[]>([]);
  const [followed, setFollowed] = useState<IFollower[]>([]);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [changeState, setChangeState] = useState(true);
  const navigate = useNavigate();

  const { isOpen: editIsOpen, toggle: editToggle } = useModal();
  const { isOpen: followerOpen, toggle: followerToggle } = useModal();
  const { isOpen: followedOpen, toggle: followedToggle } = useModal();

  const { username, user_id }: { username: string; user_id: number } = jwt_decode(
    localStorage.getItem('authToken') as string
  );
  const { userId } = useParams();
  const [isFound, setIsFound] = useState(true);

  const unfollowUser = (id: number) => {
    const selectProfile = currentUserFollowers.filter((user) => user.follower.id === id);
    setChangeState(!changeState);
    const user = selectProfile.pop();
    if (user === undefined) return;
    console.log('current user', user);

    // @ts-ignore
    setFollowers((prevState) => {
      return prevState.filter((f) => f.follower.id !== user_id);
    });

    sendDataAuthRequire(
      'DELETE',
      `${API_URL}/api/followers/${user.id}/`,
      {},
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then(() => {
      // @ts-ignore
      setUser((prevState) => ({
        ...prevState,
        followersCount: followers.length - 1
      }));
    });
  };

  const followUser = (id: number) => {
    axios
      .post(
        `${API_URL}/api/followers/`,
        { followTo: id },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem('authToken') as string).access
            }`
          }
        }
      )
      .then()
      .catch();
    // @ts-ignore
    setFollowers((prevState) => {
      console.log(prevState);
      return [
        ...prevState,
        {
          id: user?.id,
          follower: { id: user_id, avatar: user?.avatar, username: username }
        }
      ];
    });
    // @ts-ignore
    setUser((prevState) => ({
      ...prevState,
      followersCount: followers.length + 1
    }));
  };

  function checkProfileFollow() {
    return followers.filter((followerItem) => followerItem.follower.id === user_id).length > 0;
  }

  useEffect(() => {
    getResponse(
      `${API_URL}/api/profiles/${userId}/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    )
      .then((response) => {
        setUser(response.data);
      })
      .catch((e) => {
        console.log(e);
        setIsFound(false);
        setUser(null);
      });
  }, [navigate]);

  useEffect(() => {
    if (user !== null) {
      // @ts-ignore
      setUser((prevState) => ({
        ...prevState,
        followersCount: followers.length,
        followedToCount: followed.length
      }));
    }
  }, [isFollowerDelete]);

  useEffect(() => {
    getResponse(
      `${API_URL}/api/profiles/${userId}/followers/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      setFollowers(response.data);
    });
    getResponse(
      `${API_URL}/api/profiles/${userId}/followed/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      setFollowed(response.data);
    });
  }, [userId]);

  useEffect(() => {
    getResponse(
      `${API_URL}/api/profiles/${user_id}/followed/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      setCurrentUserFollowers(response.data);
    });
  }, [changeState]);

  const checkProfileViewPermission = () => {
    if (user?.id === user_id) return true;
    else if (followers.filter((followerItem) => followerItem.follower.id === user_id).length > 0)
      return true;
    return !user?.isPrivate;
  };

  if (!isFound && !user) {
    return <h1>Пользователь не найден</h1>;
  }
  if (user) {
    return (
      <>
        <div className={style.root}>
          <div className={style.container__wrap}>
            <div className={style.container}>
              <div className={style.image__section}>
                <img src={user?.avatar ? user.avatar : defaultUserLogo} alt="Profile image" />
              </div>
              <div className={style.description__section}>
                <div className={style.headline__content}>
                  <p>{user?.username}</p>
                  {user?.username === username ? (
                    <>
                      <SettingsOutlinedIcon onClick={() => editToggle()} />
                    </>
                  ) : checkProfileFollow() ? (
                    <p
                      className={`${style.follow__btn} ${style.unfollow}`}
                      onClick={() => unfollowUser(Number(userId))}
                    >
                      Unfollow
                    </p>
                  ) : (
                    <p className={style.follow__btn} onClick={() => followUser(Number(userId))}>
                      Follow
                    </p>
                  )}
                </div>
                <div className={style.profile__description}>
                  <p>{user?.description}</p>
                </div>
                <div className={style.info__section}>
                  <p>Posts: {user?.postsCount}</p>
                  <p style={{ cursor: 'pointer' }} onClick={followerToggle}>
                    Followers: {user?.followersCount}
                  </p>
                  <p style={{ cursor: 'pointer' }} onClick={followedToggle}>
                    Followed: {user?.followedToCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {checkProfileViewPermission() ? <PostContainer navigate={navigate} /> : <PagePrivate />}
          <Modal
            className={style.inbox__modal}
            style={{ width: '20%', height: '200pt', padding: 0 }}
            isOpen={editIsOpen}
            toggle={editToggle}
          >
            <EditItem
              className={style.logout__item}
              onClick={() => navigate('/profile/saved/')}
              text="Saved"
            />
            <EditItem
              className={style.logout__item}
              onClick={() => navigate('/profile/edit/')}
              text="Settings"
            />
            <EditItem className={style.logout__item} onClick={logoutUser} text="Logout" />
          </Modal>
          <Modal
            className={style.inbox__modal}
            style={{ width: '30%', height: '400pt', padding: 0 }}
            isOpen={followerOpen}
            toggle={followerToggle}
          >
            <ModalClose headlineText={'Followers'} onClose={followerToggle} />
            {checkProfileViewPermission() ? (
              <FollowersItems
                onClose={followerToggle}
                setFollowed={setFollowers}
                followed={followers}
              />
            ) : (
              <PrivateFollower />
            )}
          </Modal>

          <Modal
            className={style.inbox__modal}
            style={{ width: '30%', height: '400pt', padding: 0 }}
            isOpen={followedOpen}
            toggle={followedToggle}
          >
            <ModalClose headlineText={'Followed'} onClose={followedToggle} />
            {checkProfileViewPermission() ? (
              <FollowersItems
                onClose={followedToggle}
                setFollowed={setFollowed}
                followed={followed}
              />
            ) : (
              <PrivateFollower />
            )}
          </Modal>
        </div>
      </>
    );
  }
  return <InfinitySpin width="200" color="#4fa94d" />;
}
