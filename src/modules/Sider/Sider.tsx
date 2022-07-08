import { FC } from 'react';
import classNames from 'classnames';
import styles from './Sider.module.scss';
import { Submenu } from '../../component/submenu/Submenu';

export interface SiderProps {
  onClick: () => void; // onclick for toggle sidebar
  isSidebarOpen: boolean; // sidebar is open or not
}

export const Sider: FC<SiderProps> = ({ isSidebarOpen, onClick }) => {
  return (
    <>
      <aside className={classNames(styles.sider, isSidebarOpen ? styles.open : null)}>
        <div className={styles.sider_children}>
          <Submenu />
        </div>
      </aside>
      <div
        className={classNames(styles.background, isSidebarOpen ? styles.open : null)}
        onClick={onClick}
      />
    </>
  );
};
