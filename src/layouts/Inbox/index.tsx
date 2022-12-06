import React, { useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import style from '../../pages/InboxPage/InboxPage.module.scss';
import Modal from '../../common/ui/Modal';
import { ChatItem } from '../../pages/InboxPage';
import { UtilsContext } from '../../context/UtilsProvider';
import useModal from '../../hooks/useModal';
import { useDidUpdateEffect } from '../../hooks/useDidUpdateEffect';

export function InboxLayout() {
  const [chatType, setChatType] = useState('private');
  const [chats, setChats] = useState([
    {
      chatId: 'someID',
      title: 'SomeTitle',
      imagePath: null
    },
    {
      chatId: 'someID2',
      title: 'SomeTitle2',
      imagePath: null
    }
  ]);

  const navigate = useNavigate();
  const { isOpen, toggle, setIsOpen } = useModal();
  const { isModalOpen } = useContext(UtilsContext);

  const selectChatsType = (type: string) => {
    switch (type) {
      case 'private':
        setChatType('private');
        setChats([
          {
            chatId: 'somegroupID',
            title: 'SomeTitle',
            imagePath: null
          },
          {
            chatId: 'somegroupID2',
            title: 'SomeTitle2',
            imagePath: null
          }
        ]);
        break;
      case 'group':
        setChatType('group');
        setChats([
          {
            chatId: 'someID',
            title: 'SomeGroupTitle',
            imagePath: null
          },
          {
            chatId: 'someID2',
            title: 'SomeGroupTitle2',
            imagePath: null
          }
        ]);
        break;
    }
    navigate('/inbox');
  };

  useDidUpdateEffect(() => {
    setIsOpen(true);
  }, [isModalOpen]);

  const _selectStyle = {
    backgroundColor: '#1976D2',
    color: '#ffffff'
  };

  return (
    <main className={style.root}>
      <div className={style.inbox__root}>
        <div className={style.inbox__content}>
          <div className={style.inbox__left}>
            <div className={style.inbox__header}>
              <div
                onClick={() => selectChatsType('private')}
                style={chatType === 'private' ? _selectStyle : {}}
                className={style.inbox__separate}
              >
                private
              </div>
              <div
                onClick={() => selectChatsType('group')}
                style={chatType === 'group' ? _selectStyle : {}}
                className={style.inbox__separate}
              >
                groups
              </div>
            </div>
            <div className={style.inbox__list}>
              {chats.map((chat) => (
                <ChatItem
                  key={chat.chatId}
                  title={chat.title}
                  chatId={chat.chatId}
                  imagePath={null}
                  onClick={() => navigate(`/d/${chat.chatId}`)}
                />
              ))}
            </div>
          </div>
          <Outlet />
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
