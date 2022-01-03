import { FC } from 'react';
import classNames from 'classnames';
import styles from './Sider.module.scss';
import { Submenu } from '../../component/submenu/Submenu';
import { gapRoutes, routes } from '../../utils/routes';

export interface SiderProps {
  /**
   * onclick for toggle sidebar
   */
  onClick: () => void;
  /**
   * sidebar is open or not
   */
  isSidebarOpen: boolean;
  filteredGaps?: any[];
  onReSetLabel: (oldValue, newValue) => void;
}

/**
 * Main Sider component for user interaction
 */

export const Sider: FC<SiderProps> = ({ onReSetLabel, isSidebarOpen, filteredGaps }) => {
  return (
    <aside className={classNames(styles.sider, isSidebarOpen ? styles.open : null)}>
      <div className={styles.sider_children}>
        <Submenu
          arraySubmenu={routes(filteredGaps)}
          labels={gapRoutes(filteredGaps)}
          onReSetLabel={onReSetLabel}
        />
      </div>
    </aside>
  );
};
