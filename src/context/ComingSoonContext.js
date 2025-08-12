import React, { createContext, useState, useContext } from 'react';
import ComingSoonModal from '../Components/modals/ComingSoonModal';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const showModal = (content) => {
    setModalContent(content);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {isVisible && (
        <ComingSoonModal onClose={hideModal}>
          {modalContent}
        </ComingSoonModal>
      )}
    </ModalContext.Provider>
  );
};
