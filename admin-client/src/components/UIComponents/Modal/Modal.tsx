import React, { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';
// import AddIcon from '../AddIcon/AddIcon';
import CrossIcon from '../CrossIcon/CrossIcon';
import { includeDarkClass } from '../../../CONFIG';
import { RootState } from '../../../ReduxStore/store';
import { useSelector } from 'react-redux';

interface ModalProps {
  isOpen: Boolean;
  onClose: () => void;
  children: ReactNode;
  heading: string;
  mountOnPortal?: boolean;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, heading = "MOdal header Modal header" }, mountOnPortal) => {
  const darkMode = useSelector((state: RootState) => state.UI.theme.dark)
  if (!isOpen) return null;

  if (mountOnPortal) {
    return ReactDOM.createPortal(
      <div className={includeDarkClass("modal-overlay", darkMode)} onClick={onClose}>
        <div className={includeDarkClass("modal", darkMode)} onClick={(e) => e.stopPropagation()}>
          <div className={includeDarkClass('header_and_cosebtn_container', darkMode)}>
            <div className={includeDarkClass('modal_header', darkMode)}>
              <h3 className={includeDarkClass('', darkMode)}>{heading}</h3>
            </div>
            <div onClick={onClose} className={includeDarkClass('modal_close_btn', darkMode)}>
              <CrossIcon size={20} tooltipText='Close Modal' onClick={() => { }} />
            </div>
          </div>
          <div className={includeDarkClass('modal_main_content_container', darkMode)}>{children}</div>
        </div>
      </div>,
      document.getElementById('modal-root')!
    );
  } else {
    return (
      <div className={includeDarkClass("modal-overlay", darkMode)} onClick={onClose}>
        <div className={includeDarkClass("modal", darkMode)} onClick={(e) => e.stopPropagation()}>
          <div className={includeDarkClass('header_and_cosebtn_container', darkMode)}>
            <div className={includeDarkClass('modal_header', darkMode)}>
              <h3 className={includeDarkClass('', darkMode)}>{heading}</h3>
            </div>
            <div onClick={onClose} className={includeDarkClass('modal_close_btn', darkMode)}>
              <CrossIcon size={20} tooltipText='Close Modal' onClick={() => { }} />
            </div>
          </div>
          <div className={includeDarkClass('modal_main_content_container', darkMode)}>{children}</div>
        </div>
      </div>
    );
  }


};

export default Modal;
