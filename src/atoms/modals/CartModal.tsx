/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable max-lines */
/* eslint-disable react/require-default-props */
import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Editor from '@draft-js-plugins/editor';
import classNames from 'classnames';
import { API, Storage } from 'aws-amplify';
import { RootState } from '../../app/store';
import { closeUpdateModalIsOpen, getModalNode } from '../../reducers/getNodeId';
import styles from '../../modules/HomePage/HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import MainEditor from '../../modules/Editor/MainEditor';
import { InputNavbar } from '../../component/input/InputNavbar';
import { Chip } from '../../component/chip/Chip';
import MentionContext from '../../utils/hooks/useCreatContext';
import Collabarator from '../../component/collabarator/Collabarator';
import '../../component/cart/Color.scss';
import Images from './Images';
import { updateNode } from '../../graphql/mutations';
import { getNodesToProps, setNodesToProps, updateNodesToProps } from '../../reducers/nodes';
import { getNode } from '../../graphql/queries';

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

const CartModal: FC = () => {
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      nodeIdReducer: state.nodeIdReducer,
      editorReducer: state.editorReducer,
      isCartCollabaratorOpen: state.collabaratorReducer.isCartCollabaratorOpen,
      nodes: state.nodesReducer.nodes,
      updatedText: state.editorReducer.updatedText,
    };
  });
  const { isCartCollabaratorOpen, nodes, updatedText } = mapStateToProps;
  const { modalNode, updateModalIsOpen } = mapStateToProps.nodeIdReducer;

  const dispatch = useDispatch();
  const editorRef = useRef<Editor>(null);
  const titleRef = useRef(null);
  const [updatedColor, setUpdatedColor] = useState(undefined);
  const [linkMode, setlinkMode] = useState(false);
  const linkRef = useRef(null);
  const textRef = useRef(null);
  const [images, setImages] = useState([]);

  const onLinkEditor = () => {
    if (textRef.current.value.length === 0) textRef.current.focus();
    else linkRef.current.focus();
    createLinkToEditor();
  };

  const createLinkToEditor = () => setlinkMode((prev) => !prev);

  const onKeyPressed = (e) => {
    if (e.keyCode === 13) {
      editorRef.current?.focus();
    }
  };

  useEffect(() => {
    if (modalNode !== undefined) {
      const { color } = modalNode;

      setUpdatedColor(color);
    }
  }, [modalNode]);

  const onChangeNodeContent = useCallback(
    async (id: string, title: string, _version: number): Promise<void> => {
      try {
        const updatedNode = {
          id,
          _version,
          title,
          description: updatedText,
        };

        const data = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.updateNode;

        dispatch(getNodesToProps([]));
        dispatch(updateNodesToProps(item));
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [dispatch, updatedText],
  );

  const onUpdate = useCallback(
    async (id) => {
      try {
        const version = modalNode !== undefined && modalNode._version;
        dispatch(getModalNode(undefined));
        dispatch(closeUpdateModalIsOpen());
        // eslint-disable-next-line no-underscore-dangle
        await onChangeNodeContent(id, titleRef.current.innerText, version);
      } catch (err) {
        throw new Error('Update cart: Something went wrong');
      }
    },
    [modalNode, dispatch, onChangeNodeContent],
  );

  const toggleModal = useCallback(
    (id) => {
      if (!isCartCollabaratorOpen) {
        onUpdate(id);
        setUpdatedColor(undefined);
      }
    },
    [onUpdate, isCartCollabaratorOpen],
  );

  const onChangePin = useCallback(
    async (nodeId: string, nodePined: boolean, nodeVersion: number): Promise<CartProps> => {
      try {
        const updatedNode = {
          id: nodeId,
          pined: nodePined,
          archived: false,
          _version: nodeVersion,
        };

        const data = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.updateNode;

        dispatch(updateNodesToProps(item));
        return item;
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [dispatch],
  );

  const modalChangePin = useCallback(async () => {
    const { id, _version, pined } = modalNode;
    const data = await onChangePin(id, !pined, _version);

    dispatch(getModalNode(data));
  }, [dispatch, modalNode, onChangePin]);

  useEffect(() => {
    if (modalNode !== undefined) {
      const { img } = modalNode;

      if (img) {
        const requestedImages = img.map(async (image) => {
          const data = await Storage.get(image);
          return data;
        });

        Promise.all(requestedImages).then((values) => {
          setImages(values);
        });
      }
    }
  }, [modalNode]);

  const toggleCartLabels = useCallback(
    async (nodeId: string, nodeVersion: number, nodeLabels: string): Promise<CartProps> => {
      try {
        const data = await API.graphql({ query: getNode, variables: { nodeId } });
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

        return item;
      } catch (err) {
        throw new Error('Toggle Update Label for Carts Error');
      }
    },
    [dispatch],
  );

  const modalToggleCartLabels = useCallback(
    async (label) => {
      const { id, _version } = modalNode;
      const data = await toggleCartLabels(id, _version, label);

      dispatch(getModalNode(data));
    },
    [dispatch, modalNode, toggleCartLabels],
  );

  const userEmail = localStorage.getItem('userEmail');
  const isModal = true;
  return (
    <Modal
      removeIcon={updatedColor === undefined && true}
      color={!isCartCollabaratorOpen ? updatedColor : 'default'}
      isLarge
      isOpen={updateModalIsOpen}
      cartmodal
      toggleModal={() => modalNode !== undefined && toggleModal(modalNode.id)}
    >
      {modalNode !== undefined && (
        <Collabarator
          id={modalNode.id}
          // eslint-disable-next-line no-underscore-dangle
          _version={modalNode._version}
          isOpen={!isCartCollabaratorOpen}
          owner={modalNode.collabarator}
          cartCollabarators={modalNode.collabarators}
        />
      )}
      <>
        {modalNode !== undefined && (
          <div style={{ position: 'relative', display: isCartCollabaratorOpen && 'none' }}>
            <button type="button" className={styles.icon_btn}>
              {!modalNode.pined ? (
                <Icon name="pin" color="premium" size="xs" onClick={modalChangePin} />
              ) : (
                <Icon name="pin-black" color="premium" size="xs" onClick={modalChangePin} />
              )}
            </button>
            {images.length !== 0 && <Images images={images} />}
            <div
              className={updatedColor}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '98%',
                padding: '5px 0 10px 10px',
                position: 'absolute',
                zIndex: 10,
                background: '#fff',
              }}
            >
              <div
                ref={titleRef}
                id="title"
                className={styles.textarea}
                contentEditable
                suppressContentEditableWarning
                aria-multiline
                role="textbox"
                spellCheck
                onKeyDown={(e) => onKeyPressed(e)}
              >
                {modalNode.title}
              </div>
            </div>

            <div className={styles.main_row}>
              {modalNode && (
                <MentionContext.Provider value={() => toggleModal(modalNode.id)}>
                  <MainEditor
                    linkRef={linkRef}
                    textRef={textRef}
                    linkMode={linkMode}
                    createLinkToEditor={createLinkToEditor}
                    editorRef={editorRef}
                    initialState={modalNode.description}
                    color={updatedColor}
                    isModal
                  />
                </MentionContext.Provider>
              )}
              <div className={styles.main_chips}>
                {modalNode.labels && modalNode.labels.length > 10 ? (
                  <>
                    {modalNode.labels.slice(0, 10).map((label) => (
                      <Chip key={label} onDelate={() => modalToggleCartLabels(label)}>
                        {label}
                      </Chip>
                    ))}
                    <div className={styles.extralabel}> +{modalNode.labels.length - 10} </div>
                  </>
                ) : (
                  modalNode.labels.map((label) => (
                    <Chip key={label} onDelate={() => modalToggleCartLabels(label)}>
                      {label}
                    </Chip>
                  ))
                )}
              </div>
              {modalNode.collabarators && (
                <div className={classNames(styles.main_chips, styles.labels)}>
                  {modalNode.collabarators
                    .filter((e) => e !== userEmail)
                    .map((user) => (
                      <div key={user} className={styles.user}>
                        {user[0].toLowerCase()}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <InputNavbar
              id={modalNode.id}
              _version={modalNode._version}
              archived={modalNode.archived}
              title={modalNode.title}
              description={modalNode.description}
              onSetNode={() => toggleModal(modalNode.id)}
              updateModalIsOpen={updateModalIsOpen}
              initiallabels={modalNode && modalNode.labels}
              createLinkToEditor={onLinkEditor}
              currentColor={modalNode.color}
              selectedLabels={modalNode.labels}
              shadow
              isModal={isModal}
            />
          </div>
        )}
      </>
    </Modal>
  );
};

export default CartModal;
