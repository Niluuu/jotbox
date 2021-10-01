import { FC } from 'react';

import classNames from 'classnames';
import styles from './Modal.module.scss';
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
   * Labels
   */
  labels?: any;
  /**
   * Title of modal
   */
  title?: string;
}

// TODO: implement pure function with testable storybook

const Modal: FC<ModalProps> = ({ toggleModal, isOpen, labels, children, title }) => {
  return (
    <>
      <div className={classNames(styles.backdrop, { [styles.isOpen]: isOpen })} />
      <div className={classNames(styles['popup-container'], { [styles.isOpen]: isOpen })}>
        <div className={classNames(styles.popup)} id="popup-login">
          <div className={styles.popup__title}>
            {title}
            <Icon
              name="exit"
              size="xs"
              color="premium"
              className={styles.popup_exit_icon}
              onClick={toggleModal}
            />
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
