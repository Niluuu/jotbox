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
import OnErrorMessage from '../message/message';
import restrictDouble from '../../utils/restrictDouble/restrictDouble';
import { setUpdateNodes } from '../../reducers/nodes';
import { RootState } from '../../app/store';

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

  const [listlabels, setListlabels] = useState<LabelType[]>([
    {
      id: '1',
      _version: 1,
      title: '1',
    },
    {
      id: '2',
      _version: 1,
      title: '2',
    },
  ]);
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

      setListlabels(filteredLabels);
      return filteredLabels;
    } catch (err) {
      throw new Error('Get labels route');
    }
  }, [filter]);

  const onCreatelabel = useCallback(
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
          setListlabels([item, ...listlabels]);
        }
      } catch (err) {
        throw new Error('Create labels route');
      }
    },
    [getLabelRequest, listlabels, userEmail],
  );

  const onDeletelabel = useCallback(
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
          setListlabels(listlabels.filter((elm) => elm.id !== id));
        }
      } catch (err) {
        throw new Error('label DELETE route');
      }
    },
    [listlabels],
  );

  const onUpdatelabel = useCallback(
    async (title, id, _version) => {
      const updatedLabel = {
        title,
        id,
        _version,
      };

      try {
        const currentlabelData = await API.graphql({ query: getLabel, variables: { id } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const currentlabelRes = currentlabelData.data.getLabel;
        const currentlabel = currentlabelRes.title;

        const nodeData = await API.graphql({
          query: listNodes,
          variables: { filter },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { items } = nodeData.data.listNodes;
        // eslint-disable-next-line no-underscore-dangle
        const filteredNodes = items.filter((elm) => elm._deleted === null);

        const labelItems = await getLabelRequest();
        const duplicate = labelItems.map((label) => label.title);

        const complete = async () => {
          const newData = await API.graphql({
            query: updateLabel,
            variables: { input: updatedLabel },
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore
          const item = newData.data.updateLabel;
          setListlabels(listlabels.map((elm) => (elm.id === id ? item : elm)));

          filteredNodes.forEach(async (element) => {
            const updatedlabels = element.labels.map((elm) => (elm === currentlabel ? title : elm));
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
          const answer = `You want to this label merged to "${title}`;
          // eslint-disable-next-line no-restricted-globals
          if (confirm(answer)) complete();
        } else complete();
      } catch (err) {
        throw new Error('Update labels route');
      }
    },
    [filter, getLabelRequest, listlabels, dispatch],
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

  const arraySubmenu = routes(listlabels);

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
        onCreatelabel={onCreatelabel}
        onUpdatelabel={onUpdatelabel}
        onDeletelabel={onDeletelabel}
        listlabels={listlabels}
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
