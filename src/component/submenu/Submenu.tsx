/* eslint-disable react/require-default-props */
/* eslint-disable no-alert */
import { FC, useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { API } from 'aws-amplify';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../../modules/Sider/Sider.module.scss';
import { Icon } from '../Icon/Icon';
import { SubmenuModal } from '../../atoms/modals/SubmenuModal';
import { routes } from '../../utils/routes/index';
import { getLabel, listLabels, listNodes } from '../../graphql/queries';
import { createLabel, updateLabel, deleteLabel, updateNode } from '../../graphql/mutations';
import restrictDouble from '../../utils/restrictDouble/restrictDouble';
import { setUpdateNodes } from '../../reducers/nodes';
import { RootState } from '../../app/store';
import { setStoreLabels } from '../../reducers/labels';

type LabelType = {
  id: string;
  _version: number;
  title: string;
};

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
  const collabarator = { eq: userEmail };

  const [labels, setLabels] = useState<LabelType[]>([]);
  const [isOpenLabel, setIsOpenLabel] = useState(false);
  const toggleModal = useCallback(() => setIsOpenLabel(!isOpenLabel), [isOpenLabel]);
  const [hasError, setHasError] = useState(false);
  const [filter] = useState({ collabarator });

  const dispatch = useDispatch();
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      refreshPage: state.refreshPageReducer.refreshPage,
    };
  });

  const { refreshPage } = mapStateToProps;

  const getLabelRequest = useCallback(async () => {
    try {
      const res = await API.graphql({ query: listLabels, variables: { filter } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = res.data.listLabels;
      // eslint-disable-next-line no-underscore-dangle
      const noneDeletedItems = items.filter((elm) => elm._deleted !== true);

      const filteredLabels = restrictDouble(noneDeletedItems);

      setLabels(filteredLabels);
      dispatch(setStoreLabels(filteredLabels));
      return filteredLabels;
    } catch (err) {
      throw new Error('Get labels route');
    }
  }, [dispatch, filter]);

  const onCreateLabel = useCallback(
    async (title) => {
      try {
        const newCollabarators = [userEmail];
        const items = await getLabelRequest();
        const newLabel = {
          title,
          collabarator: userEmail,
          collabarators: newCollabarators,
        };
        const duplicate = items.map((label) => label.title);

        if (duplicate.includes(title)) {
          setHasError(true);
        } else {
          setHasError(false);
          const data = await API.graphql({ query: createLabel, variables: { input: newLabel } });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore
          const item = data.data.createLabel;
          setLabels([item, ...labels]);
          dispatch(setStoreLabels([item, ...labels]));
        }
      } catch (err) {
        throw new Error('Create labels route');
      }
    },
    [dispatch, getLabelRequest, labels, userEmail],
  );

  const onDeleteLabel = useCallback(
    async (id, _version) => {
      try {
        const data = await API.graphql({
          query: deleteLabel,
          variables: { input: { id, _version } },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.deleteLabel;
        // eslint-disable-next-line no-underscore-dangle
        if (item._deleted) {
          setLabels(labels.filter((elm) => elm.id !== id));
          dispatch(setStoreLabels(labels.filter((elm) => elm.id !== id)));
        }
      } catch (err) {
        throw new Error('label DELETE route');
      }
    },
    [dispatch, labels],
  );

  const onUpdateLabel = useCallback(
    async (title, id, _version) => {
      const updatedLabel = {
        title,
        id,
        _version,
      };

      try {
        const currentLabel = labels.find((elm) => elm.id === id);
        const currentTitle = currentLabel.title;

        const duplicate = labels.map((label) => label.title);

        const nodeData = await API.graphql({
          query: listNodes,
          variables: { filter },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { items } = nodeData.data.listNodes;
        // eslint-disable-next-line no-underscore-dangle
        const filteredNodes = items.filter((elm) => elm._deleted === null);

        const complete = async () => {
          const newData = await API.graphql({
            query: updateLabel,
            variables: { input: updatedLabel },
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore
          const item = newData.data.updateLabel;
          setLabels(labels.map((elm) => (elm.id === id ? item : elm)));
          dispatch(setStoreLabels(labels.map((elm) => (elm.id === id ? item : elm))));

          filteredNodes.forEach(async (element) => {
            const updatedlabels = element.labels.map((elm) => (elm === currentTitle ? title : elm));
            const updatedNode = {
              id: element.id,
              // eslint-disable-next-line no-underscore-dangle
              _version: element._version,
              labels: updatedlabels,
            };
            await API.graphql({
              query: updateNode,
              variables: { input: updatedNode },
            });
          });

          dispatch(setUpdateNodes());
        };

        if (duplicate.includes(title)) {
          const answer = `You want to merge this label to "${title}?`;
          // eslint-disable-next-line no-restricted-globals
          if (confirm(answer)) {
            onDeleteLabel(id, _version);
            setLabels(labels.filter((elm) => elm.id !== id));
          }
        } else complete();
      } catch (err) {
        throw new Error('Update labels route');
      }
    },
    [labels, filter, dispatch, onDeleteLabel],
  );

  useEffect(() => {
    getLabelRequest();
  }, [getLabelRequest]);

  useEffect(() => {
    getLabelRequest();
  }, [refreshPage, getLabelRequest]);

  useEffect(() => {
    if (!isOpenLabel) setHasError(false);
  }, [isOpenLabel]);

  const arraySubmenu = routes(labels);

  return (
    <ul className={styles.sider_menu}>
      {arraySubmenu !== undefined &&
        arraySubmenu.map((item) =>
          item.name === 'labels' ? (
            item.labels.map((label) => <SubmenuItem item={label} location={pathname} />)
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
        hasError={hasError}
        isOpenLabel={isOpenLabel}
        toggleModal={toggleModal}
        onCreateLabel={onCreateLabel}
        onUpdateLabel={onUpdateLabel}
        onDeleteLabel={onDeleteLabel}
        listLabels={labels}
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
  const dispatch = useDispatch();
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
