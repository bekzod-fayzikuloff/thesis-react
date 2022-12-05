import style from './Modal.module.scss';
import React, { CSSProperties, ReactNode } from 'react';

interface ModalType {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  isOpen: boolean;
  toggle: () => void;
}

export default function Modal(props: ModalType) {
  return (
    <>
      {props.isOpen && (
        <div className={`${style.modal__overlay} ${props.className}`} onClick={props.toggle}>
          <div
            style={props.style}
            onClick={(e) => e.stopPropagation()}
            className={style.modal__box}
          >
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}
