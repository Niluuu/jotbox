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

interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  labels: string[];
  _version: number;
  _deleted: boolean;
  color: string;
  collabarators: string[];
  collabarator: string;
  img: string[];
}

interface InputNavbarProps {
  /**
   * Is main input navbar?
   */
  isMainInput?: boolean;
  /**
   * Create node func
   */
  onSetNode?: () => void;
  /**
   * Archived node func
   */
  onSetArchive?: () => void;
  /**
   * Node toggle archived func
   */
  onChangeArchived?: () => void;
  /**
   * Create link text to editor
   */
  createLinkToEditor?: () => void;
  /**
   * Node current color
   */
  currentColor?: string;
  /**
   * Node pre color
   */
  defaultColor?: string;
  /**
   * Node set defoult color func
   */
  onDefaultColor?: (optionalColor: string) => void;
  /**
   * Node initial labels
   */
  initiallabels?: string[];
  /**
   * Oncreate node toggleselected labels
   */
  togglelabels?: (label: string) => void;
  /**
   * Oncreate selected labels
   */
  selectedLabels: string[];
  /**
   * Is Modal? Should navbar has shadow in Modal?
   */
  shadow?: boolean;
  /**
   * Attr Link should not bee in carts
   */
  isCart?: boolean;
  /**
   * Open Cart Modal function
   */
  onOpenModal?: () => void;
  updateModalIsOpen?: boolean;
  hide?: boolean;
  label?: string;
  /**
   * Node Id
   */
  id?: string;
  /**
   * Node version of node
   */
  _version?: number;
  /**
   * Node archived or not?
   */
  archived?: boolean;
  /**
   * Node title
   */
  title?: string;
  /**
   * Node description
   */
  description?: string;
  /**
   * Node labels
   */
  labels?: string[] | null;
  img?: any[];
  cleanUpParent?: () => void;
  /**
   * Node title
   */
  titleInnerText?: string | null;
  defaultPin?: boolean;
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
    img,
    defaultColor,
    titleInnerText,
    onDefaultColor,
    cleanUpParent,
    isModal,
    defaultPin,
    selectedLabels,
    togglelabels,
  } = props;
  const [labels, setLabels] = useState([]);
  const dispatch = useDispatch();
  const userEmail = localStorage.getItem('userEmail');

  const { t } = useTranslation();

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      nodes: state.nodesReducer.nodes,
      storeLabels: state.labelReducer.storeLabels,
      inputCollabaratorUsers: state.collabaratorReducer.inputCollabaratorUsers,
      text: state.editorReducer.text,
    };
  });

  const { storeLabels, nodes, inputCollabaratorUsers, text } = mapStateToProps;

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
    async (nodeId: string, color: string, nodeVersion: number): Promise<CartProps> => {
      try {
        const updatedNode = {
          id: nodeId,
          color,
          _version: nodeVersion,
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
    [dispatch, isModal],
  );

  const onRemoveCart = useCallback(
    async (nodeId: string, nodeVersion: number): Promise<CartProps> => {
      try {
        const data = await API.graphql({
          query: deleteNode,
          variables: { input: { id: nodeId, _version: nodeVersion } },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.deleteNode;

        // eslint-disable-next-line no-underscore-dangle
        if (item._deleted) {
          dispatch(removeNodesToProps(nodeId));

          if (isModal) dispatch(closeUpdateModalIsOpen());
        }
        return item;
      } catch (err) {
        throw new Error('Remove node error');
      }
    },
    [dispatch, isModal],
  );

  const onChangeArchived = useCallback(
    async (
      nodeId: string,
      archiveAttr: boolean,
      nodeVersion: number,
      nodeTitle: string,
      nodeDescription: string,
    ): Promise<CartProps> => {
      try {
        const updatedNode = {
          id: nodeId,
          archived: !archiveAttr,
          _version: nodeVersion,
          title: nodeTitle,
          description: nodeDescription,
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
    },
    [dispatch, isModal],
  );

  const toggleCartLabels = useCallback(
    async (nodeId: string, nodeVersion: number, nodeLabels: string): Promise<CartProps> => {
      try {
        const data = await API.graphql({ query: getNode, variables: { id: nodeId } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const cart = data.data.getNode;
        const cartlabels = cart.labels;

        const updatedlabels = cartlabels.includes(nodeLabels)
          ? cartlabels.filter((cartlabel: string) => cartlabel !== nodeLabels)
          : [...cartlabels, nodeLabels];

        const updatedNode = { id: nodeId, _version: nodeVersion, labels: updatedlabels };

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
    [dispatch, isModal],
  );

  const toggleSelectedlabel = useCallback(
    (e) => {
      if (isMainInput) togglelabels(e.target.value);
      else toggleCartLabels(id, _version, e.target.value);
    },
    [isMainInput, togglelabels, toggleCartLabels, id, _version],
  );

  const toggleArchive = () => {
    if (isMainInput) onSetArchive();
    else onChangeArchived(id, archived, _version, title, description);
  };

  const onSetNodes = useCallback(async () => {
    try {
      const newCollabarators = [userEmail, ...inputCollabaratorUsers];

      const nodesImg = [];

      img.forEach(async (currentImg) => {
        nodesImg.push(currentImg.name);

        await Storage.put(currentImg.name, currentImg, {
          contentType: 'image/png', // contentType is optional
        });
      });

      const node = {
        title: titleInnerText,
        description: text,
        labels: selectedLabels,
        pined: defaultPin,
        color: defaultColor,
        archived: false,
        collabarator: userEmail,
        collabarators: newCollabarators,
        img: nodesImg,
      };

      console.log(titleInnerText);
      console.log(node);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const parsedText = JSON.parse(text);

      if (parsedText.blocks[0].text && titleInnerText) {
        const data = await API.graphql({ query: createNode, variables: { input: node } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.createNode;

        dispatch(setNodesToProps(item));

        cleanUp();
        cleanUpParent();
      }
    } catch (err) {
      throw new Error('Create node error');
    }
  }, [
    userEmail,
    inputCollabaratorUsers,
    img,
    titleInnerText,
    text,
    selectedLabels,
    defaultPin,
    defaultColor,
    dispatch,
    cleanUp,
    cleanUpParent,
  ]);

  const onSetArchive = useCallback(async () => {
    try {
      const newCollabarators = [userEmail, ...inputCollabaratorUsers];

      const nodesImg = [];

      img.forEach(async (currentImg) => {
        nodesImg.push(currentImg.name);

        await Storage.put(currentImg.name, currentImg, {
          contentType: 'image/png', // contentType is optional
        });
      });

      const node = {
        title: titleInnerText,
        description: text,
        labels: selectedLabels,
        pined: defaultPin,
        color: defaultColor,
        archived: true,
        collabarator: userEmail,
        collabarators: newCollabarators,
        img: nodesImg,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const parsedText = JSON.parse(text);

      if (parsedText.blocks[0].text && titleInnerText) {
        const data = await API.graphql({ query: createNode, variables: { input: node } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.createNode;

        dispatch(setNodesToProps(item));

        cleanUp();
        cleanUpParent();
      }
    } catch (err) {
      throw new Error('Create node error');
    }
  }, [
    userEmail,
    inputCollabaratorUsers,
    img,
    titleInnerText,
    text,
    selectedLabels,
    defaultPin,
    defaultColor,
    dispatch,
    cleanUp,
    cleanUpParent,
  ]);

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
                      else onColorChange(id, color, _version);
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
              onClick={() => onRemoveCart(id, _version)}
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
