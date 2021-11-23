import { FC,useState } from 'react';
import classNames from 'classnames';
import styles from './Sider.module.scss';
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
  filteredGaps?: any[];
}

/**
 * Main Sider component for user interaction
 */

export const Sider: FC<SiderProps> = ({ className, isSidebarOpen, filteredGaps }) => {
  const labels = filteredGaps.map(gap => ({
    name: gap, url: `/gap/${gap}`, icon: 'notes'
  }))

  const initial = [
    { name: 'Заметки', gaps: null, icon: 'notes', active: true, url: '/', modal: false },
    { name: 'Напоминания', gaps: null, icon: 'notification', active: false, url: '/reminders', modal: false },
    {
      name: 'gaps', icon: null, active: null, url: null, modal: null,
      gaps: labels
    },
    { name: 'Изменение ярлыков', gaps: null, icon: 'labels', url: '/*', modal: true },
    { name: 'Архив', gaps: null, icon: 'archive', active: false, url: '/archives', modal: false },
    { name: 'Корзина', gaps: null, icon: 'basket', active: false, url: '/trash', modal: false },
  ];

  return (
    <aside className={classNames(styles.sider, isSidebarOpen ? styles.open: null)}>
      <div className={styles.sider_children}>
      <Submenu arraySubmenu={initial} labels={labels} />
      </div>
    </aside>
  );
};
