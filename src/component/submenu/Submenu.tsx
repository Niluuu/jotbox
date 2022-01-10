import { FC, useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import styles from '../../modules/Sider/Sider.module.scss';
import { Icon } from '../Icon/Icon';
import { SubmenuModal } from '../../atoms/modals/SubmenuModal';
import { routes } from '../../utils/routes/index';
import { listGapss } from '../../graphql/queries';
import { createGaps, updateGaps } from '../../graphql/mutations';
import { gapsToProps } from '../../reducers/gaps';

export interface SubmenuProps {
  /**
   * ClassName
   */
  className?: string;
  /**
   * onclick for toggle sidebar
   */
  onClick?: () => void;
}

/**
 * Main Submenu component for user interaction
 */

export const Submenu: FC<SubmenuProps> = () => {
  const location = useLocation();
  const { pathname } = location;
  const [isOpenLabel, setIsOpenLabel] = useState(false);
  const [listGaps, setListGaps] = useState([]);
  const toggleModal = useCallback(() => setIsOpenLabel(!isOpenLabel), [isOpenLabel]);

  async function getGaps() {
    try {
      const res = await API.graphql(graphqlOperation(listGapss));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = res.data.listGapss;

      setListGaps(items);
    } catch (err) {
      throw new Error('Get gaps route');
    }
  }

  useEffect(() => {
    getGaps();
  }, []);

  const onCreateGap = useCallback(async (title) => {
    const collabarator = localStorage.getItem('userEmail');
    const newLabel = {
      title,
      collabarator,
    };

    try {
      await await API.graphql({ query: createGaps, variables: { input: newLabel } });
    } catch (err) {
      throw new Error('Get gaps route');
    }
  }, []);

  const onUpdateGap = useCallback(async (title, id, _version) => {
    const updatedLabel = {
      title,
      id,
      _version,
    };

    try {
      const res = await API.graphql({ query: updateGaps, variables: { input: updatedLabel } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const newLabel = res.data.updateGaps;
      const updatedList = listGaps.filter((gap) => gap.id !== newLabel.id);

      setListGaps([...updatedList, newLabel]);
    } catch (err) {
      throw new Error('Get gaps route');
    }
  }, []);

  useEffect(() => {
    getGaps();
  }, [onCreateGap, onUpdateGap]);

  const arraySubmenu = routes(listGaps);

  return (
    <ul className={styles.sider_menu}>
      {arraySubmenu !== undefined &&
        arraySubmenu.map((item) =>
          item.name === 'gaps' ? (
            item.gaps.map((gap) => <SubmenuItem item={gap} location={pathname} />)
          ) : (
            <SubmenuItem
              location={pathname}
              modal={item.modal}
              item={item}
              toggleModal={toggleModal}
              isOpenLabel={isOpenLabel}
            />
          ),
        )}
      <SubmenuModal
        isOpenLabel={isOpenLabel}
        toggleModal={toggleModal}
        onCreateGap={onCreateGap}
        onUpdateGap={onUpdateGap}
        listGaps={listGaps}
      />
    </ul>
  );
};

interface SubmenuItemProps {
  item: any;
  location: any;
  modal?: boolean;
  toggleModal?: () => void;
  isOpenLabel?: boolean;
}

const SubmenuItem: FC<SubmenuItemProps> = ({ item, location, modal, toggleModal }) => {
  return (
    <li className={styles.sider_submenu}>
      {modal ? (
        <div className={styles.sider_submenu__menu_item} onClick={toggleModal}>
          <Icon name={`${item.icon}`} color="premium" size="xs" />
          <span className={styles.menu_item__title}>{item.name}</span>
        </div>
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
