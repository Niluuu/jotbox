import { FC } from 'react';
import classNames from 'classnames';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';

interface TrashInputNavbarProps {
  onRestoreTrash?: () => void;
  onRemoveTrash?: () => void;
}

export const TrashInputNavbar: FC<TrashInputNavbarProps> = ({
  onRemoveTrash,
  onRestoreTrash,
}) => {
  return (
    <div className={classNames(styles.input_navbar)}>
      <div className={classNames(styles.main_tools)}>
        <button onClick={onRemoveTrash} type="button" className={styles.icon_btn}>
          <Icon name="delete-forever" color="premium" size="xs" />
        </button>
        <button onClick={onRestoreTrash} type="button" className={styles.icon_btn}>
          <Icon name="restore" color="premium" size="xs" />
        </button>
      </div>
    </div>
  );
};
