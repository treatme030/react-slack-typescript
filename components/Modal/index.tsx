import React, { FC, useCallback } from 'react';
import { CreateModal, CloseModalButton } from '@components/Modal/styles';

interface Props {
  onCloseModal: () => void;
}

const Modal: FC<Props> = ({ children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  },[]);

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
      { children }
      </div>
    </CreateModal>
  );
};

export default Modal;