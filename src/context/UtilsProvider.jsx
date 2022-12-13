import { createContext, useState } from 'react';

const UtilsContext = createContext();

const UtilsProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(!isModalOpen);
  };

  const changeFollowersState = () => {
    setFollowerDelete(!isFollowerDelete);
  };

  const [isFollowerDelete, setFollowerDelete] = useState(false);

  const contextData = {
    isModalOpen,
    openModal,
    isFollowerDelete,
    changeFollowersState
  };

  return <UtilsContext.Provider value={contextData}>{children}</UtilsContext.Provider>;
};
export { UtilsContext };
export { UtilsProvider };
