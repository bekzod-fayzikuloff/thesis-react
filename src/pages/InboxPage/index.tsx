import style from './InboxPage.module.scss';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import { Button } from '@mui/material';
import defaultUserLogo from '../../assets/images/default_user.jpg';
import { useContext } from 'react';
import { UtilsContext } from '../../context/UtilsProvider';

export function MessageArea(props: { chatId: string | null }) {
  return (
    <div className={style.inbox__right}>
      <div className={style.inbox__header}>header</div>
      <p>{props.chatId}</p>
    </div>
  );
}

interface IChatItem {
  onClick?: () => void;
  chatId: string;
  title: string;
  imagePath: string | null;
}

export function ChatItem(props: IChatItem) {
  return (
    <div onClick={props.onClick} className={style.inbox__item}>
      <div className={style.inbox__content}>
        <img
          style={{ width: '52px', height: '52px', borderRadius: '50%' }}
          src={props.imagePath ? props.imagePath : defaultUserLogo}
          alt=""
        />
        <p>{props.title}</p>
      </div>
    </div>
  );
}

export function InboxEmpty() {
  const { openModal } = useContext(UtilsContext);

  return (
    <div className={style.inbox__right}>
      <div className={style.inbox__empty}>
        <MapsUgcOutlinedIcon onClick={openModal} className={style.message__icon} />
        <p style={{ fontSize: '24px', fontWeight: 'initial' }}>Your Inbox</p>
        <p style={{ fontSize: '16px', color: '#8E8E8E' }}>
          Send message to your friends or groups.
        </p>
        <Button
          onClick={openModal}
          variant="contained"
          sx={{
            fontSize: 12
          }}
        >
          Send messages
        </Button>
      </div>
    </div>
  );
}
