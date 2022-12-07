import style from './Sidebar.module.scss';
import {SidebarItem} from './SidebarItem';
import {useNavigate} from 'react-router-dom';
import Modal from '../../common/ui/Modal';
import useModal from '../../hooks/useModal';
import jwt_decode from "jwt-decode";

export function Sidebar() {
  const navigate = useNavigate();
  const {isOpen, toggle} = useModal();
  const handleClick = () => {
    toggle();
  };
  const {user_id}: { user_id: number } = jwt_decode(localStorage.getItem('authToken') as string)
  const makeNavigation = (toLink: string): void => {
    navigate(toLink);
  };

  return (
    <div className={style.side__root}>
      <SidebarItem
        className={style.side__headline}
        toLink="/"
        toRepr="Falcon"
        onClick={() => makeNavigation('/')}
      />
      <SidebarItem toLink="/" toRepr="Feed"
                   onClick={() => makeNavigation('/')}/>
      <SidebarItem toLink="/inbox" toRepr="Messages"
                   onClick={() => makeNavigation('/inbox')}/>
      <SidebarItem toLink={`/profile/${user_id}`} toRepr="Profile"
                   onClick={() => makeNavigation(`/profile/${user_id}`)}/>
      <SidebarItem toLink="#" toRepr="Search" onClick={handleClick}/>
      <Modal isOpen={isOpen} toggle={toggle}>
        <p>Hello World</p>
      </Modal>
      <div className={style.side__anchor}>
        <p>Falcon</p>
      </div>
    </div>
  );
}
