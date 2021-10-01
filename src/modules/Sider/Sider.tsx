import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Sider.module.scss';
import { Icon } from '../../component/Icon/Icon';
import { Submenu } from '../../component/submenu/Submenu';

export interface SiderProps {
  /**
   * User login or not
   */
  isLoggedIn?: boolean;
  /**
   * ClassName
   */
  className?: string;
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

export const Sider: FC<SiderProps> = ({ className, isSidebarOpen }) => {
  const [labels, setlabels] = useState([
    { name: 'gap1', icon: 'gaps', active: false, url: '/gap/1', modal: false },
  ]);

  const arraySubMenu = [
    { name: 'Заметки', icon: 'notes', active: true, url: '/', modal: false },
    { name: 'Напоминания', icon: 'notification', active: false, url: '/reminders', modal: false },
    {
      name: 'gaps',
      gaps: labels,
    },
    { name: 'Изменение ярлыков', icon: 'labels', url: '/*', modal: true },
    { name: 'Архив', icon: 'archive', active: false, url: '/archives', modal: false },
    { name: 'Корзина', icon: 'basket', active: false, url: '/trash', modal: false },
  ];

  const [sidebarLinks, setsidebarLinks] = useState(arraySubMenu);

  return (
    <aside className={classNames(styles.sider, isSidebarOpen ? styles.open : null)}>
      <div className={styles.sider_childern}>
        <Submenu arraySubmenu={arraySubMenu} labels={labels} />
      </div>
    </aside>
  );
};
