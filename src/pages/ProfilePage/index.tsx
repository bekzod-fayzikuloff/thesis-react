import style from "./Profile.module.scss"
import defaultUserLogo from '../../assets/images/default_user.jpg';
import {Button} from "@mui/material";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {useNavigate, useParams} from "react-router-dom";
import Modal from "../../common/ui/Modal";
import useModal from "../../hooks/useModal";
import {CSSProperties, ReactNode, useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {getResponse} from "../../services/utils/sendRequest";
import {API_URL} from "../../config";
import jwt_decode from "jwt-decode";
import {InfinitySpin} from "react-loader-spinner";


const PostContainer = () => {
  const navigate = useNavigate()
  const posts = [
    {
      id: 1,
      image: defaultUserLogo
    },
    {
      id: 2,
      image: defaultUserLogo
    },
    {
      id: 3,
      image: defaultUserLogo
    },
    {
      id: 4,
      image: defaultUserLogo
    },
    {
      id: 5,
      image: defaultUserLogo
    },
    {
      id: 6,
      image: defaultUserLogo
    },
    {
      id: 7,
      image: defaultUserLogo
    }
  ]
  return (
    <div className={style.grid__wrapper}>
      <div className={style.grid}>
        {posts.map((item: any) => {
          return (
            <div key={item.id}>
              <img
                onClick={() => navigate(`/p/${item.id}`)}
                src={item.image}
                referrerPolicy="no-referrer" alt=""
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}


const EditItem = (props: {
  onClick?: () => void
  className?: string
  style?: CSSProperties
  children?: ReactNode
  text?: string
}) => {
  return (
    <div onClick={props.onClick} className={style.edit__item}>
      {props.text ? <p>{props.text}</p> : props.children}
    </div>
  )
}


interface IUserProfile {
  id: number
  username: string
  followersCount: number
  followedToCount: number
  postsCount: number
  "createdAt": string
  "updatedAt": string
  "avatar": string | null
  "description": string
}

export function ProfilePage() {
  const {logoutUser} = useContext(AuthContext)
  const [user, setUser] = useState<IUserProfile | null>(null)
  const navigate = useNavigate()
  const {isOpen, toggle} = useModal()
  const {username}: { username: string } = jwt_decode(localStorage.getItem('authToken') as string)
  const {userId} = useParams()
  const [isFound, setIsFound] = useState(true)

  useEffect(() => {
      console.log("useEffect")
      getResponse(
        `${API_URL}/api/profiles/${userId}/`,
        JSON.parse(localStorage.getItem('authToken') as string).access
      ).then(response => {
        setUser(response.data)
        console.log(user)
      }).catch(
        e => {
          console.log(e)
          setIsFound(false)
          setUser(null)
        }
      )
    }, []
  )
  if (!isFound && !user) {
    return <h1>Пользователь не найден</h1>
  }
  if (user) {
    return (
      <>
        <div className={style.root}>
          <div className={style.container__wrap}>
            <div className={style.container}>
              <div className={style.image__section}>
                <img src={user?.avatar ? user.avatar : defaultUserLogo}
                     alt="Profile image"/>
              </div>
              <div className={style.description__section}>
                <div className={style.headline__content}>
                  <p>{user?.username}</p>
                  {
                    (user?.username === username) ? (
                      <><Button
                        style={{
                          padding: "1px 17px",
                          marginLeft: "17pt",
                          marginRight: "7pt"
                        }}
                        variant="outlined"
                        sx={{
                          fontSize: 12
                        }}
                        onClick={() => navigate("/profile/edit")}
                      >Edit</Button>
                        <SettingsOutlinedIcon onClick={() => toggle()}/>
                      </>
                    ) : <h1>guest</h1>
                  }

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
          <PostContainer/>
          <Modal
            className={style.inbox__modal}
            style={{width: '20%', height: "200pt", padding: 0}}
            isOpen={isOpen}
            toggle={toggle}
          >
            <EditItem onClick={logoutUser} text="Logout"/>
          </Modal>
        </div>
      </>

    );
  }
  return <InfinitySpin width="200" color="#4fa94d"/>
}
