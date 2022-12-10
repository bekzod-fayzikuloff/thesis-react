import style from './Profile.module.scss';
import defaultUserLogo from '../../assets/images/default_user.jpg';
import { Button } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../common/ui/Modal';
import useModal from '../../hooks/useModal';
import { CSSProperties, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getResponse } from '../../services/utils/sendRequest';
import { API_URL } from '../../config';
import jwt_decode from 'jwt-decode';
import { InfinitySpin } from 'react-loader-spinner';

type Media = {
  id: number;
  createdAt: string;
  updatedAt: string;
  file: string;
};

interface IPost {
  id: number;
  medias: Media[];
}

const PostContainer = (props: { userId: number; navigate: any }) => {
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

interface IUserProfile {
  id: number;
  username: string;
  followersCount: number;
  followedToCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
  avatar: string | null;
  description: string;
}

export function ProfilePage() {
  const { logoutUser } = useContext(AuthContext);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const navigate = useNavigate();
  const { isOpen, toggle } = useModal();
  const { username }: { username: string } = jwt_decode(
    localStorage.getItem('authToken') as string
  );
  const { userId } = useParams();
  const [isFound, setIsFound] = useState(true);

  useEffect(() => {
    console.log('GGG');
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
                      <SettingsOutlinedIcon onClick={() => toggle()} />
                    </>
                  ) : (
                    <h1>guest</h1>
                  )}
                </div>
                <div>
                  <p>{user?.description}</p>
                  <p>Posts: {user?.postsCount}</p>
                  <p>Followers: {user?.followersCount}</p>
                  <p>Followed: {user?.followedToCount}</p>
                </div>
              </div>
            </div>
          </div>
          <PostContainer userId={user?.id} navigate={navigate} />
          <Modal
            className={style.inbox__modal}
            style={{ width: '20%', height: '200pt', padding: 0 }}
            isOpen={isOpen}
            toggle={toggle}
          >
            <EditItem onClick={logoutUser} text="Logout" />
          </Modal>
        </div>
      </>
    );
  }
  return <InfinitySpin width="200" color="#4fa94d" />;
}
