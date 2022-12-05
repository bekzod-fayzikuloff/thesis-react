import style from './InboxPage.module.scss';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import useModal from '../../hooks/useModal';
import Modal from '../../common/ui/Modal';
import defaultUserLogo from '../../assets/images/default_user.jpg';

function MessageArea() {
  return (
    <div className={style.inbox__right}>
      <div className={style.inbox__header}>header</div>
      <p>Right</p>
    </div>
  );
}

interface IChatItem {
  onClick?: () => void;
  chatId: string;
  title: string;
  imagePath: string | null;
}

function ChatItem(props: IChatItem) {
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

function InboxEmpty(props: { modalHandler: () => void }) {
  return (
    <div className={style.inbox__right}>
      <div className={style.inbox__empty}>
        <MapsUgcOutlinedIcon onClick={props.modalHandler} className={style.message__icon} />
        <p style={{ fontSize: '24px', fontWeight: 'initial' }}>Your Inbox</p>
        <p style={{ fontSize: '16px', color: '#8E8E8E' }}>
          Send message to your friends or groups.
        </p>
        <Button
          onClick={props.modalHandler}
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

export function InboxPage() {
  const [isChatOpen, setChatOpen] = useState(false);
  const { isOpen, toggle } = useModal();
  const handleClick = () => {
    toggle();
  };

  const openChat = () => {
    setChatOpen(true);
  };

  useEffect(() => {
    console.log('SendMessage Modal open');
  }, []);

  return (
    <main className={style.root}>
      <div className={style.inbox__root}>
        <div className={style.inbox__content}>
          <div className={style.inbox__left}>
            <div className={style.inbox__header}>header</div>
            <div className={style.inbox__list}>
              <ChatItem
                title={'someTitle'}
                chatId={'sdsdsds'}
                imagePath={null}
                onClick={openChat}
              />
            </div>
          </div>

          {isChatOpen ? <MessageArea /> : <InboxEmpty modalHandler={handleClick} />}
        </div>
      </div>
      <Modal
        className={style.inbox__modal}
        style={{ width: '40%' }}
        isOpen={isOpen}
        toggle={toggle}
      >
        <p>Hello World</p>
      </Modal>
    </main>
  );
}
