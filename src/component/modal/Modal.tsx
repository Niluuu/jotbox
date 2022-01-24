import { FC, useRef } from 'react';

import classNames from 'classnames';
import useOnClickOutside from '../../utils/hooks/useOnClickOutside';
import styles from './Modal.module.scss';
import '../cart/Color.scss';
import { Icon } from '../Icon/Icon';

export interface ModalProps {
  /**
   * Control Login Open/Closed state
   */
  isOpen?: boolean;
  /**
   * Pass close action
   */
  toggleModal?: () => void;
  /**
   * Title of modal
   */
  title?: string;
  isLarge?: boolean;
  isTop?: boolean;
  removeIcon?: boolean;
  cartmodal?: boolean;
  color?: string;
}

// TODO: implement pure function with testable storybook

const Modal: FC<ModalProps> = ({
  toggleModal,
  removeIcon,
  isOpen,
  isLarge,
  isTop,
  children,
  title,
  color,
  cartmodal,
}) => {
  const modalRef = useRef(null);
  const outsideClick = () => {
    if (isOpen)
      setTimeout(() => {
        toggleModal();
      }, 1000);
  };
  useOnClickOutside(modalRef, outsideClick);
  return (
    <>
      <div className={classNames(styles.backdrop, { [styles.isOpen]: isOpen })} />
      <div className={classNames(styles['popup-container'], { [styles.isOpen]: isOpen })}>
        <div
          ref={modalRef}
          className={classNames(
            styles.popup,
            isTop && styles.top,
            isLarge && styles.large,
            color,
            removeIcon && styles.hide,
            cartmodal && styles.cartmodal,
          )}
          id="popup-login"
        >
          <div className={styles.popup__title}>{title}</div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
