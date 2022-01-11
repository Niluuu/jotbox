import { FC } from 'react';

import classNames from 'classnames';
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
}) => {
  return (
    <>
      <div className={classNames(styles.backdrop, { [styles.isOpen]: isOpen })} />
      <div className={classNames(styles['popup-container'], { [styles.isOpen]: isOpen })}>
        <div
          className={classNames(
            styles.popup,
            isTop && styles.top,
            isLarge && styles.large,
            color,
            removeIcon && styles.hide,
          )}
          id="popup-login"
        >
          <div className={styles.popup__title}>
            {title}
            {!removeIcon && (
              <Icon
                name="exit"
                size="xs"
                color="premium"
                className={styles.popup_exit_icon}
                onClick={toggleModal}
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
