import { createContext, useState } from 'react';

const UtilsContext = createContext();

const UtilsProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    console.log('some shit');
    setModalOpen(!isModalOpen);
  };

  const contextData = {
    isModalOpen,
    openModal
  };

  return <UtilsContext.Provider value={contextData}>{children}</UtilsContext.Provider>;
};
export { UtilsContext };
export { UtilsProvider };
