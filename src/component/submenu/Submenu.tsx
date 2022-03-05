/* eslint-disable react/require-default-props */
/* eslint-disable no-alert */
import { FC, useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../../modules/Sider/Sider.module.scss';
import { Icon } from '../Icon/Icon';
import { SubmenuModal } from '../../atoms/modals/SubmenuModal';
import { routes } from '../../utils/routes/index';
import { getGaps, listGapss, listNodes } from '../../graphql/queries';
import { createGaps, updateGaps, deleteGaps, updateNode } from '../../graphql/mutations';
import OnErrorMessage from '../message/message';
import restrictDouble from '../../utils/restrictDouble/restrictDouble';
import { setUpdateNodes } from '../../reducers/nodes';
import { RootState } from '../../app/store';

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
  const userEmail = localStorage.getItem('userEmail');

  const [isOpenLabel, setIsOpenLabel] = useState(false);
  const [listGaps, setListGaps] = useState([]);
  const toggleModal = useCallback(() => setIsOpenLabel(!isOpenLabel), [isOpenLabel]);
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      refresh: state.refreshReducer.refresh,
    };
  });

  const { refresh } = mapStateToProps;

  const getGapsRequest = useCallback(async () => {
    try {
      const res = await API.graphql(graphqlOperation(listGapss));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = res.data.listGapss;
      // eslint-disable-next-line no-underscore-dangle
      const noneDeletedItems = items.filter((elm) => elm._deleted !== true);

      const filteredLabels = restrictDouble(noneDeletedItems);

      setListGaps(filteredLabels);
      return filteredLabels;
    } catch (err) {
      throw new Error('Get gaps route');
    }
  }, []);

  const onCreateGap = useCallback(
    async (title) => {
      try {
        const items = await getGapsRequest();
        const newLabel = {
          title,
        };
        const duplicate = items.map((gap) => gap.title);

        if (duplicate.includes(title)) {
          setHasError(true);
        } else {
          setHasError(false);
          const data = await API.graphql({ query: createGaps, variables: { input: newLabel } });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore
          const item = data.data.createGaps;
          setListGaps([item, ...listGaps]);
        }
      } catch (err) {
        throw new Error('Create gaps route');
      }
    },
    [getGapsRequest, listGaps],
  );

  const onDeleteGap = useCallback(
    async (id, _version) => {
      try {
        const data = await API.graphql({
          query: deleteGaps,
          variables: { input: { id, _version } },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.deleteGaps;
        // eslint-disable-next-line no-underscore-dangle
        if (item._deleted) {
          setListGaps(listGaps.filter((elm) => elm.id !== id));
        }
      } catch (err) {
        throw new Error('Gap DELETE route');
      }
    },
    [listGaps],
  );

  const onUpdateGap = useCallback(
    async (title, id, _version) => {
      const updatedLabel = {
        title,
        id,
        _version,
      };

      try {
        const collabarator = { eq: userEmail };

        const currentGapData = await API.graphql({ query: getGaps, variables: { id } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const currentGapRes = currentGapData.data.getGaps;
        const currentGap = currentGapRes.title;

        const nodeData = await API.graphql({
          query: listNodes,
          variables: { filter: { collabarator } },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { items } = nodeData.data.listNodes;
        // eslint-disable-next-line no-underscore-dangle
        const filteredNodes = items.filter((elm) => elm._deleted === null);

        const gapItems = await getGapsRequest();
        const duplicate = gapItems.map((gap) => gap.title);

        const complete = async () => {
          const newData = await API.graphql({
            query: updateGaps,
            variables: { input: updatedLabel },
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore
          const item = newData.data.updateGaps;
          setListGaps(listGaps.map((elm) => (elm.id === id ? item : elm)));

          filteredNodes.forEach(async (element) => {
            const updatedGaps = element.gaps.map((elm) => (elm === currentGap ? title : elm));
            // eslint-disable-next-line no-underscore-dangle
            const updatedNode = { id: element.id, _version: element._version, gaps: updatedGaps };
            await API.graphql({
              query: updateNode,
              variables: { input: updatedNode },
            });
          });

          dispatch(setUpdateNodes());
        };

        if (duplicate.includes(title)) {
          const answer = `You want to this gap merged to "${title}`;
          // eslint-disable-next-line no-restricted-globals
          if (confirm(answer)) complete();
        } else complete();
      } catch (err) {
        throw new Error('Update gaps route');
      }
    },
    [getGapsRequest, userEmail, listGaps, dispatch],
  );

  useEffect(() => {
    getGapsRequest();
  }, [getGapsRequest]);

  useEffect(() => {
    getGapsRequest();
  }, [refresh, getGapsRequest]);

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

const SubmenuItem: FC<SubmenuItemProps> = ({ item, location, modal, toggleModal, isOpenLabel }) => {
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
