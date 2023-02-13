import axios from 'axios';
import {useEffect, useState} from 'react';
import jwt_decode from 'jwt-decode';
import {API_URL} from '../../config';
import {IPostGroup, IPostGroupDetail} from '../../types';
import style from './SavedPage.module.scss';
import {useNavigate, useParams} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Modal from '../../common/ui/Modal';
import useModal from '../../hooks/useModal';
import AddIcon from '@mui/icons-material/Add';
import {Button, TextField} from '@mui/material';

const SavedPageHeader = (props: { backRef: string }) => {
  const navigate = useNavigate();
  return (
    <header className={style.saved__head}>
      <ArrowBackIcon style={{cursor: 'pointer'}}
                     onClick={() => navigate(props.backRef)}/>
    </header>
  );
};

export const SavedPage = () => {
  const {isOpen: addIsOpen, toggle: addToggle} = useModal();
  const {user_id: currentUserId}: { user_id: number } = jwt_decode(
    localStorage.getItem('authToken') as string
  );
  const [postsGroups, setPostsGroups] = useState<IPostGroup[]>([]);
  const [groupName, setGroupName] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${API_URL}/api/profiles/${currentUserId}/post_groups`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('authToken') as string).access}`
        }
      })
      .then((r) => {
        console.log(r.data);
        setPostsGroups(r.data);
      });
  }, []);

  const addGroupHandler = () => {
    axios
      .post(`${API_URL}/api/posts-groups/`, {
        title: groupName,
        creator: currentUserId
      })
      .then((response) => {
        console.log(response.data);
        setPostsGroups((prevState) => [...prevState, response.data]);
      });
    setGroupName('');
  };
  return (
    <div className={style.root}>
      <SavedPageHeader backRef={`/profile/${currentUserId}`}/>
      <div className={style.detail__group}>
        <div className={style.groups__stack}>
          <div className={style.add__group}>
            <p onClick={addToggle}>
              <span>Add new posts group</span>
              <br/>
              <AddIcon/>
            </p>
          </div>

          {postsGroups.map((postG) => {
            return (
              <div
                onClick={() => navigate(`/saved/${postG.id}`)}
                style={
                  postG.postsThumbnail && Object.keys(postG.postsThumbnail).length !== 0
                    ? {
                      backgroundImage: `url(${API_URL}${postG.postsThumbnail.medias[0].file})`
                    }
                    : {}
                }
                key={postG.id}
              >
                <div className={style.saved__anchor}>
                  <p>{postG.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={addIsOpen}
        toggle={addToggle}
        className={style.inbox__modal}
        style={{
          height: '320px',
          width: '520px'
        }}
      >
        <TextField
          style={{width: '100%'}}
          onChange={(e) => setGroupName(e.target.value)}
          value={groupName}
          id="standard-basic"
          label="Posts collection name"
          variant="standard"
        />
        <br/>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10pt'
          }}
        >
          <Button
            variant={'contained'}
            endIcon={<AddIcon/>}
            onClick={() => {
              addToggle();
              addGroupHandler();
            }}
          >
            Add groups
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export const SavedDetailPage = () => {
  const [savedGroup, setSavedGroup] = useState<IPostGroupDetail>();
  const {savedId} = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${API_URL}/api/posts-groups/${savedId}`).then((response) => {
      console.log(response.data);
      setSavedGroup(response.data);
    });
  }, []);
  return (
    <div className={style.root}>
      <SavedPageHeader backRef={`/profile/saved/`}/>
      <div className={style.detail__group}>
        <div className={style.groups__stack}>
          {savedGroup?.posts.map((post) => {
            return (
              <div onClick={() => navigate(`/p/${post.id}`)}
                   className={style.detail__post}
                   key={post.id}>
                <img src={`${API_URL}${post.medias[0].file}`} alt=""/>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
