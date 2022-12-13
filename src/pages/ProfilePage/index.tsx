import style from './Profile.module.scss';
import defaultUserLogo from '../../assets/images/default_user.jpg';
import { Button } from '@mui/material';
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

export type Media = {
  id: number;
  createdAt: string;
  updatedAt: string;
  file: string;
};

export interface IPost {
  id: number;
  medias: Media[];
}

const deleteFollower = (followerId: number) => {
  sendDataAuthRequire(
    'POST',
    `${API_URL}/api/followers/${followerId}/`,
    {},
    JSON.parse(localStorage.getItem('authToken') as string).access
  )
    .then((r) => {
      console.log(r);
    })
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

const FollowerItem = (props: { followerItem: IFollower }) => {
  const { changeFollowersState } = useContext(UtilsContext);
  return (
    <div className={style.follower__item}>
      <div>
        <img
          style={{
            margin: '4pt',
            width: '36px',
            height: '36px',
            borderRadius: '50%'
          }}
          src={
            props.followerItem.follower.avatar
              ? props.followerItem.follower.avatar
              : defaultUserLogo
          }
          alt=""
        />
      </div>
      <p>
        <span>{props.followerItem.follower.username}</span>
      </p>
      <div>
        <span
          onClick={() => {
            deleteFollower(props.followerItem.id);
            changeFollowersState();
          }}
        >
          delete
        </span>
      </div>
    </div>
  );
};

const PostContainer = (props: { navigate: any }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const { userId } = useParams();
  useEffect(() => {
    getResponse(
      `${API_URL}/api/posts/?created_by=${userId}`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      setPosts(response.data.results);
    });
  }, [props.navigate]);

  return (
    <div className={style.grid__wrapper}>
      <div className={style.grid}>
        {posts.map((post: IPost) => {
          return (
            <div key={post?.id}>
              <img
                onClick={() => props.navigate(`/p/${post?.id}`)}
                src={post?.medias[0]?.file}
                referrerPolicy="no-referrer"
                alt=""
              />
            </div>
          );
        })}
      </div>
    </div>
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
    <div onClick={props.onClick} className={style.edit__item}>
      {props.text ? <p>{props.text}</p> : props.children}
    </div>
  );
};

export interface IUserProfile {
  id: number;
  username: string;
  followersCount: number;
  followedToCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
  avatar: string | null;
  description: string;
  isPrivate: boolean;
}

export interface IFollower {
  id: number;
  follower: {
    id: number;
    avatar: null | string;
    username: string;
  };
}

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

export function ProfilePage() {
  const { logoutUser } = useContext(AuthContext);
  const { isFollowerDelete } = useContext(UtilsContext);
  const [followers, setFollowers] = useState<IFollower[]>([]);
  const [followed, setFollowed] = useState<IFollower[]>([]);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const navigate = useNavigate();

  const { isOpen: editIsOpen, toggle: editToggle } = useModal();
  const { isOpen: followerOpen, toggle: followerToggle } = useModal();
  const { isOpen: followedOpen, toggle: followedToggle } = useModal();

  const { username, user_id }: { username: string; user_id: number } = jwt_decode(
    localStorage.getItem('authToken') as string
  );
  const { userId } = useParams();
  const [isFound, setIsFound] = useState(true);

  useEffect(() => {
    getResponse(
      `${API_URL}/api/profiles/${userId}/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    )
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
        setIsFound(false);
        setUser(null);
      });
  }, [navigate, isFollowerDelete]);

  useEffect(() => {
    console.log('render followers change');
    getResponse(
      `${API_URL}/api/profiles/${userId}/followers/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      console.log(response.data);
      setFollowers(response.data);
    });
    getResponse(
      `${API_URL}/api/profiles/${userId}/followed/`,
      JSON.parse(localStorage.getItem('authToken') as string).access
    ).then((response) => {
      console.log('followed', response.data);
      setFollowed(response.data);
    });
  }, [userId, isFollowerDelete]);

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
                      <Button
                        style={{
                          padding: '1px 17px',
                          marginLeft: '17pt',
                          marginRight: '7pt'
                        }}
                        variant="outlined"
                        sx={{
                          fontSize: 12
                        }}
                        onClick={() => navigate('/profile/edit')}
                      >
                        Edit
                      </Button>
                      <SettingsOutlinedIcon onClick={() => editToggle()} />
                    </>
                  ) : (
                    <h1>guest</h1>
                  )}
                </div>
                <div>
                  <p>{user?.description}</p>
                  <p>Posts: {user?.postsCount}</p>
                  <p onClick={followerToggle}>Followers: {user?.followersCount}</p>
                  <p onClick={followedToggle}>Followed: {user?.followedToCount}</p>
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
            <EditItem onClick={logoutUser} text="Logout" />
          </Modal>
          <Modal
            className={style.inbox__modal}
            style={{ width: '30%', height: '400pt', padding: 0 }}
            isOpen={followerOpen}
            toggle={followerToggle}
          >
            <ModalClose headlineText={'Followers'} onClose={followerToggle} />
            <div className={style.followers_listbox}>
              {followers.map((followerItem) => (
                <FollowerItem key={followerItem.id} followerItem={followerItem} />
              ))}
            </div>
          </Modal>

          <Modal
            className={style.inbox__modal}
            style={{ width: '30%', height: '400pt', padding: 0 }}
            isOpen={followedOpen}
            toggle={followedToggle}
          >
            <ModalClose headlineText={'Followed'} onClose={followedToggle} />
            <div className={style.followers_listbox}>
              {followed.map((followedItem) => (
                <FollowerItem key={followedItem.id} followerItem={followedItem} />
              ))}
            </div>
          </Modal>
        </div>
      </>
    );
  }
  return <InfinitySpin width="200" color="#4fa94d" />;
}
