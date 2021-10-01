import { FC } from 'react';
import classNames from 'classnames';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';

interface InputNavbarProps {
  isLogin?: boolean;
  withHistory?: boolean;
}

export const InputNavbar: FC<InputNavbarProps> = ({ isLogin, withHistory }) => {
  return (
    <div className={styles.input_navbar}>
      <div className={styles.main_tools}>
        <button type="button" className={styles.icon_btn}>
          <Icon name="notification-add" color="premium" size="xs" />
        </button>
        <button type="button" className={styles.icon_btn}>
          <Icon name="user-add" color="premium" size="xs" />
        </button>
        <button type="button" className={styles.icon_btn}>
          <Icon name="color-picer" color="premium" size="xs" />
        </button>
        <button type="button" className={styles.icon_btn}>
          <Icon name="img" color="premium" size="xs" />
        </button>
        <button type="button" className={styles.icon_btn}>
          <Icon name="dowland" color="premium" size="xs" />
        </button>
        <button type="button" className={styles.icon_btn}>
          <Icon name="other" color="premium" size="xs" />
        </button>
        {withHistory ? (
          <>
            <button type="button" className={styles.icon_btn}>
              <Icon name="back" color="premium" size="xs" />
            </button>
            <button type="button" className={classNames(styles.icon_btn, styles.icon_rotate)}>
              <Icon name="back" color="premium" size="xs" />
            </button>
          </>
        ) : null}
      </div>
      {withHistory ? (
        <button type="button" className={styles.btn}>
          Закрыть
        </button>
      ) : null}
    </div>
  );
};
