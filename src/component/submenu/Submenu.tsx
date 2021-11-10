import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import styles from '../../modules/Sider/Sider.module.scss';
import { Icon } from '../Icon/Icon';
import Modal from '../modal/Modal';
import { SubmenuModal } from './SubmenuModal';

export interface SubmenuProps {
  /**
   * ClassName
   */
  className?: string;
  /**
   * onclick for toggle sidebar
   */
  onClick?: () => void;
  /**
   * sidebar arrays
   */
  arraySubmenu?: any;
  /**
   * sidebar labels
   */
  labels?: any;
  filtered: any
}

/**
 * Main Submenu component for user interaction
 */

export const Submenu: FC<SubmenuProps> = ({ arraySubmenu, filtered, labels }) => {
  const [isOpenLabel, setIsOpenLabel] = useState(false);
  const location = useLocation();
  const { pathname } = location;

  const toggleModal = useCallback(() => setIsOpenLabel(!isOpenLabel), [isOpenLabel]);

  return (
    <ul className={styles.sider_menu}>
      {arraySubmenu.map((item) =>
        item.name === 'gaps' ? (
          item.gaps.map((gap) => <SubmenuItem item={gap} location={pathname} />)
        ) : (
          <SubmenuItem
            location={pathname}
            modal={item.modal}
            item={item}
            toggleModal={toggleModal}
            isOpenLabel={isOpenLabel}
            labels={labels}
            gaps={arraySubmenu}
          />
        ),
      )}
      { filtered.map((item) =>
        <NavLink to={`/gaps/${item}`} activeClassName="active" key={item}>
        <div
          className={classNames(
            styles.sider_submenu__menu_item,
            location === item ? styles.active : null,
          )}>
          <Icon name="gaps" color="premium" size="xs" />
          <span className={styles.menu_item__title}> {item}</span>
        </div>
      </NavLink>
      )}
    </ul>
  );
};

interface SubmenuItemProps {
  item: any;
  location: any;
  modal?: boolean;
  toggleModal?: () => void;
  labels?: any;
  isOpenLabel?: boolean;
  gaps?: any;
}

const SubmenuItem: FC<SubmenuItemProps> = ({
  item,
  location,
  modal,
  toggleModal,
  isOpenLabel,
  labels,
  gaps,
}) => {
  return (
    <li className={styles.sider_submenu}>
      {modal ? (
        <>
          <div className={styles.sider_submenu__menu_item} onClick={toggleModal}>
            <Icon name={`${item.icon}`} color="premium" size="xs" />
            <span className={styles.menu_item__title}>{item.name}</span>
          </div>
          <SubmenuModal
            isOpenLabel={isOpenLabel}
            labels={labels}
            toggleModal={toggleModal}
            gaps={gaps}
          />
        </>
      ) : (
        <NavLink to={item.url} activeClassName="active" key={item.name}>
          <div
            className={classNames(
              styles.sider_submenu__menu_item,
              location === item.url ? styles.active : null,
            )}
          >
            <Icon name={`${item.icon}`} color="premium" size="xs" />
            <span className={styles.menu_item__title}> {item.name}</span>
          </div>
        </NavLink>
      )}
    </li>
  );
};
