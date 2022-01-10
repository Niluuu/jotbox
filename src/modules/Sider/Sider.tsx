import { FC } from 'react';
import classNames from 'classnames';
import styles from './Sider.module.scss';
import { Submenu } from '../../component/submenu/Submenu';

export interface SiderProps {
  /**
   * onclick for toggle sidebar
   */
  onClick: () => void;
  /**
   * sidebar is open or not
   */
  isSidebarOpen: boolean;
}

/**
 * Main Sider component for user interaction
 */

export const Sider: FC<SiderProps> = ({ isSidebarOpen }) => {
  return (
    <aside className={classNames(styles.sider, isSidebarOpen ? styles.open : null)}>
      <div className={styles.sider_children}>
        <Submenu />
      </div>
    </aside>
  );
};
