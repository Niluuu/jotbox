/* eslint-disable no-console */
/* eslint-disable max-lines */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { FC, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { API, Storage } from 'aws-amplify';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import Popover from '../popover/Popover';
import '../cart/Color.scss';
import { COLORS } from '../../utils/editor/color';
import {
  toggleIsInputCollabaratorOpen,
  toggleIsCartCollabaratorOpen,
  setInputCollabaratorUsers,
} from '../../reducers/collabarator';
import { setUndo, setRedo, toggleOnCreateFunctionCall } from '../../reducers/editor';
import { RootState } from '../../app/store';
import { removeNodesToProps, setNodesToProps, updateNodesToProps } from '../../reducers/nodes';
import { createNode, deleteNode, updateNode } from '../../graphql/mutations';
import { getNode } from '../../graphql/queries';
import { closeUpdateModalIsOpen, getModalNode } from '../../reducers/getNodeId';
import { CartProps } from '../../utils/types';

interface InputNavbarProps {
  isMainInput?: boolean; // Is main input navbar?
  onSetNodes?: () => void; // Create node func
  onSetArchive?: () => void; // Archived node func
  onChangeArchived?: () => void; //  Node toggle archived func
  createLinkToEditor?: () => void; // Create link text to editor
  currentColor?: string; // Node current color
  defaultColor?: string; // Node pre color
  onDefaultColor?: (optionalColor: string) => void; // Node set defoult color func
  initiallabels?: string[]; // Node initial labels
  togglelabels?: (label: string) => void; // Oncreate node toggleselected labels
  selectedLabels: string[]; // Oncreate selected labels
  shadow?: boolean; // Is Modal? Should navbar has shadow in Modal?
  isCart?: boolean; // Attr Link should not bee in carts
  onOpenModal?: () => void; // Open Cart Modal function
  updateModalIsOpen?: boolean;
  hide?: boolean;
  label?: string;
  id?: string; // Node Id
  _version?: number; // Node version of node
  archived?: boolean; // Node archived or not?
  title?: string; // Node title
  description?: string; // Node description
  labels?: string[] | null; //  Node labels
  img?: any[]; // Node Images
  isModal?: boolean;
}

export const InputNavbar: FC<InputNavbarProps> = (props) => {
  const {
    isMainInput,
    createLinkToEditor,
    currentColor,
    shadow,
    isCart,
    onOpenModal,
    hide,
    label,
    id,
    _version,
    archived,
    title,
    description,
    defaultColor,
    onDefaultColor,
    isModal,
    selectedLabels,
    togglelabels,
    onSetNodes,
    onSetArchive,
  } = props;
  const { t } = useTranslation();
  const [labels, setLabels] = useState([]);
  const dispatch = useDispatch();

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      nodes: state.nodesReducer.nodes,
      storeLabels: state.labelReducer.storeLabels
    };
  });

  const { storeLabels } = mapStateToProps;

  const undoRedo = (callBack: () => void) => {
    dispatch(callBack());
    setTimeout(() => dispatch(callBack()));
  };

  const handleEditorUndo = () => undoRedo(setUndo);

  const handleEditorRedo = () => undoRedo(setRedo);

  const onLabelFilter = useCallback(
    async (value: string) => {
      try {
        const newlabels = storeLabels.filter((elm) =>
          elm.title.toLowerCase().includes(value.toLowerCase()),
        );

        setLabels(newlabels);
      } catch (err) {
        throw new Error('Error filter by Letter');
      }
    },
    [storeLabels],
  );

  const toggleCollabarator = () => {
    if (isMainInput) dispatch(toggleIsInputCollabaratorOpen());
    else {
      dispatch(toggleIsCartCollabaratorOpen());
      if (isCart) onOpenModal();
    }
  };

  const cleanUp = useCallback(() => {
    dispatch(setInputCollabaratorUsers([]));
    dispatch(toggleOnCreateFunctionCall(true));

    setTimeout(() => {
      dispatch(toggleOnCreateFunctionCall(false));
    }, 500);
  }, [dispatch]);

  useEffect(() => {
    setLabels(storeLabels);
  }, [storeLabels]);

  const onColorChange = useCallback(
    async (color: string): Promise<CartProps> => {
      try {
        const updatedNode = {
          id,
          color,
          _version,
        };

        const data = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.updateNode;

        if (isModal) dispatch(getModalNode(item));

        dispatch(updateNodesToProps(item));

        return item;
      } catch (err) {
        throw new Error('Color update error');
      }
    },
    [_version, dispatch, id, isModal],
  );

  const onRemoveCart = useCallback(async (): Promise<CartProps> => {
    try {
      const data = await API.graphql({
        query: deleteNode,
        variables: { input: { id, _version } },
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const item = data.data.deleteNode;

      // eslint-disable-next-line no-underscore-dangle
      if (item._deleted) {
        dispatch(removeNodesToProps(id));

        if (isModal) dispatch(closeUpdateModalIsOpen());
      }
      return item;
    } catch (err) {
      throw new Error('Remove node error');
    }
  }, [_version, dispatch, id, isModal]);

  const onChangeArchived = useCallback(async (): Promise<CartProps> => {
    try {
      const updatedNode = {
        id,
        archived: !archived,
        _version,
        title,
        description,
        pined: false,
      };

      const data = await API.graphql({
        query: updateNode,
        variables: { input: updatedNode },
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const item = data.data.updateNode;

      dispatch(updateNodesToProps(item));

      if (isModal) dispatch(closeUpdateModalIsOpen());

      return item;
    } catch (err) {
      throw new Error('Update node error');
    }
  }, [_version, archived, description, dispatch, id, isModal, title]);

  const toggleCartLabels = useCallback(
    async (nodeLabels: string): Promise<CartProps> => {
      try {
        const data = await API.graphql({ query: getNode, variables: { id } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const cart = data.data.getNode;
        const cartlabels = cart.labels;

        const updatedlabels = cartlabels.includes(nodeLabels)
          ? cartlabels.filter((cartlabel: string) => cartlabel !== nodeLabels)
          : [...cartlabels, nodeLabels];

        const updatedNode = { id, _version, labels: updatedlabels };

        const newData = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = newData.data.updateNode;

        dispatch(updateNodesToProps(item));

        if (isModal) dispatch(getModalNode(item));

        return item;
      } catch (err) {
        throw new Error('Toggle Update Label for Carts Error');
      }
    },
    [_version, dispatch, id, isModal],
  );

  const toggleSelectedlabel = useCallback(
    (e) => {
      if (isMainInput) togglelabels(e.target.value);
      else toggleCartLabels(e.target.value);
    },
    [isMainInput, togglelabels, toggleCartLabels],
  );

  const toggleArchive = () => {
    if (isMainInput) onSetArchive();
    else onChangeArchived();
  };

  return (
    <>
      <div
        style={{ display: hide && 'none' }}
        className={classNames(styles.input_navbar, shadow && styles.shadow)}
      >
        <div className={styles.main_tools}>
          <button onClick={toggleArchive} type="button" className={styles.icon_btn}>
            <Icon name="dowland" color="premium" size="xs" />
          </button>
          <button onClick={toggleCollabarator} type="button" className={styles.icon_btn}>
            <Icon name="user-add" color="premium" size="xs" />
          </button>
          <Popover
            placement="bottom-start"
            content={
              <div className={styles.colorWrapper}>
                {Object.values(COLORS).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      if (isMainInput) onDefaultColor(color);
                      else onColorChange(color);
                    }}
                    className={classNames(
                      color,
                      isMainInput
                        ? color === defaultColor && styles.activeColor
                        : color === currentColor && styles.activeColor,
                    )}
                  >
                    {color === 'default' && <Icon name="default-color" color="premium" size="xs" />}
                  </button>
                ))}
              </div>
            }
          >
            <button type="button" className={styles.icon_btn}>
              <Icon name="color-picer" color="premium" size="xs" />
            </button>
          </Popover>
          <Popover
            content={
              <div className={classNames(styles.navbar_popover, styles.navbar_popover_settings)}>
                <ul className={styles.popover_content}>
                  <div className={styles.labelWrapper}>
                    <h5> {t('add-label')} </h5>
                    <div className={styles.labelSearch}>
                      <input
                        type="text"
                        onChange={(e) => onLabelFilter(e.currentTarget.value)}
                        placeholder={`${t('enter-label-name')}...`}
                      />
                      <Icon size="min" name="search" />
                    </div>
                    <div className={styles.item}>
                      {labels.map((localLabel) => (
                        <li key={localLabel.id} className={styles.labelItems}>
                          <label>
                            <input
                              type="checkbox"
                              value={localLabel.title}
                              onChange={(e) => {
                                if (label !== localLabel.title) {
                                  toggleSelectedlabel(e);
                                  console.log('label', labels);
                                  console.log('select', selectedLabels);
                                }
                              }}
                              checked={selectedLabels.includes(localLabel.title)}
                            />
                            {selectedLabels.includes(localLabel.title) ? (
                              <Icon name="edit-bordered" color="premium" size="xs" />
                            ) : (
                              <Icon name="box" color="premium" size="xs" />
                            )}
                            <span> {localLabel.title} </span>
                          </label>
                        </li>
                      ))}
                    </div>
                  </div>
                </ul>
              </div>
            }
            placement="bottom-start"
          >
            <button type="button" className={styles.icon_btn}>
              <Icon name="label" color="premium" size="xs" />
            </button>
          </Popover>
          {!isCart && (
            <button onClick={createLinkToEditor} type="button" className={styles.icon_btn}>
              <Icon name="addlink" color="premium" size="xs" />
            </button>
          )}
          {isMainInput && (
            <>
              <button onClick={handleEditorUndo} type="button" className={styles.icon_btn}>
                <Icon name="back" color="premium" size="xs" />
              </button>
              <button
                className={classNames(styles.icon_btn, styles.icon_rotate)}
                onClick={handleEditorRedo}
                type="button"
              >
                <Icon name="back" color="premium" size="xs" />
              </button>
            </>
          )}
          {!isMainInput && (
            <button
              onClick={() => onRemoveCart()}
              type="button"
              className={classNames(styles.icon_btn)}
            >
              <Icon name="delete" color="premium" size="xs" />
            </button>
          )}
        </div>
        {(isMainInput || shadow) && (
          <button
            onClick={onSetNodes}
            type="button"
            className={classNames(styles.btn, styles.close)}
          >
            {t('close')}
          </button>
        )}
      </div>
    </>
  );
};
