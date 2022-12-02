import style from './Modal.module.scss';
import React, { ReactNode } from 'react';

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

export default function Modal(props: ModalType) {
  return (
    <>
      {props.isOpen && (
        <div className={style.modal__overlay} onClick={props.toggle}>
          <div onClick={(e) => e.stopPropagation()} className={style.modal__box}>
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}
