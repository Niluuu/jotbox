import { FC, useEffect } from 'react';

import classNames from 'classnames';
import styles from './Modal.module.scss';
import '../cart/Color.scss';
import { closeUpdateModalIsOpen } from '../../reducers/getNodeId';
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
  /**
   * Should modal be bigger?
   */
  isLarge?: boolean;
  isTop?: boolean;
  /**
   * Should exit modal icon appear?
   */
  removeIcon?: boolean;
  /**
   * Is modal for Carts?
   */
  cartmodal?: boolean;
  /**
   * Color of Modal (Cart)
   */
  color?: string;
  left?: boolean;
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
  left,
}) => {
  useEffect(() => {
    if (isOpen) {
      const body = document.querySelector('body');
      body.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') toggleModal();
      });
    }
  });

  return (
    <>
      <div
        onClick={toggleModal}
        className={classNames(styles.backdrop, { [styles.isOpen]: isOpen })}
      />
      <div className={classNames(styles['popup-container'], { [styles.isOpen]: isOpen })}>
        <div
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
          <div className={classNames(styles.popup__title, left && styles.left)}>
            <span>{title}</span>
            {left && (
              <Icon
                onClick={toggleModal}
                className={styles.popup_exit_icon}
                name="remove"
                color="premium"
                size="xs"
              />
            )}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
