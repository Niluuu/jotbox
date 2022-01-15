/* eslint-disable no-alert */
import { FC, useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import classNames from 'classnames';
import styles from '../../modules/Sider/Sider.module.scss';
import { Icon } from '../Icon/Icon';
import { SubmenuModal } from '../../atoms/modals/SubmenuModal';
import { routes } from '../../utils/routes/index';
import { listGapss } from '../../graphql/queries';
import { createGaps, updateGaps, deleteGaps } from '../../graphql/mutations';
import OnErrorMessage from '../message/message';

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
  const [hasError, setHasError] = useState(false);

  const getGaps = useCallback(async () => {
    try {
      const res = await API.graphql(graphqlOperation(listGapss));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = res.data.listGapss;

      const newLabels = new Set();
      const filteredLabels = items.filter((label) => {
        const duplicate = newLabels.has(label.title);
        newLabels.add(label.title);
        return !duplicate;
      });

      setListGaps(filteredLabels);
      return items;
    } catch (err) {
      throw new Error('Get gaps route');
    }
  }, []);

  const onCreateGap = useCallback(
    async (title) => {
      const collabarator = localStorage.getItem('userEmail');
      const newLabel = {
        title,
        collabarator,
      };

      try {
        const items = await getGaps();
        const duplicate = items.map((gap) => gap.title);

        if (duplicate.includes(title)) {
          setHasError(true);
        } else {
          setHasError(false);
          await API.graphql({ query: createGaps, variables: { input: newLabel } });
        }
        getGaps();
      } catch (err) {
        throw new Error('Create gaps route');
      }
    },
    [getGaps],
  );

  const onDeleteGap = useCallback(
    async (id, _version) => {
      try {
        await API.graphql({ query: deleteGaps, variables: { input: { id, _version } } });
        getGaps();
      } catch (err) {
        throw new Error('Gap DELETE route');
      }
    },
    [getGaps],
  );

  const onUpdateGap = useCallback(
    async (title, id, _version) => {
      const updatedLabel = {
        title,
        id,
        _version,
      };

      try {
        const items = await getGaps();
        const duplicate = items.map((gap) => gap.title);

        const complete = async () => {
          await API.graphql({ query: updateGaps, variables: { input: updatedLabel } });
        };

        if (duplicate.includes(title)) {
          const answer = `You want to this gap merged to "${title}`;
          // eslint-disable-next-line no-restricted-globals
          if (confirm(answer)) complete();
        } else complete();
        getGaps();
      } catch (err) {
        throw new Error('Get gaps route');
      }
    },
    [getGaps],
  );

  useEffect(() => {
    getGaps();
  }, [getGaps]);

  useEffect(() => {
    if (!isOpenLabel) setHasError(false);
  }, [isOpenLabel]);

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
        onDeleteGap={onDeleteGap}
        listGaps={listGaps}
      />
      <OnErrorMessage
        active={hasError}
        success={false}
        message="This Gap Already exists. Rename it"
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
