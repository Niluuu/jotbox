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
import { updateNodesToProps } from '../../reducers/nodes';
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
  const { isCartCollabaratorOpen, updatedText } = mapStateToProps;
  const { modalNode, updateModalIsOpen } = mapStateToProps.nodeIdReducer;

  const dispatch = useDispatch();
  const editorRef = useRef<Editor>(null);
  const titleRef = useRef(null);
  const [updatedColor, setUpdatedColor] = useState(undefined);
  const [linkMode, setlinkMode] = useState(false);
  const linkRef = useRef(null);
  const textRef = useRef(null);
  const [images, setImages] = useState([]);

  const [checkouts, setCheckouts] = useState(
    modalNode && modalNode.checkouts
      ? modalNode.checkouts.map((checkout) => ({ ...checkout, focused: false }))
      : [],
  );
  const mainCheckoutRef = useRef<HTMLInputElement>(null);

  const onChangeMainCheckout = (title: string) => {
    mainCheckoutRef.current.blur();
    mainCheckoutRef.current.value = '';

    const newCheckout = { title, focused: true, id: Date.now(), checked: false };
    setCheckouts([...checkouts, newCheckout]);
  };

  const onChangeCheckouts = (id: number, title: string) => {
    setCheckouts(
      checkouts.map((checkout) => (checkout.id === id ? { ...checkout, title } : checkout)),
    );
  };

  const onFocusCheckouts = (id: number) => {
    setCheckouts(
      checkouts.map((checkout) =>
        checkout.id === id ? { ...checkout, focused: !checkout.focused } : checkout,
      ),
    );
  };

  const onCheckoutChecked = (id: number) => {
    setCheckouts(
      checkouts.map((checkout) =>
        checkout.id === id ? { ...checkout, checked: !checkout.checked } : checkout,
      ),
    );
  };

  const onRemoveCheckout = (id: number) => {
    setCheckouts(checkouts.filter((checkout) => checkout.id !== id));
  };

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
    async (title: string): Promise<void> => {
      const { id, _version } = modalNode;

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

        dispatch(updateNodesToProps(item));
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [dispatch, modalNode, updatedText],
  );

  const onChangePin = useCallback(async (): Promise<CartProps> => {
    const { id, _version, pined } = modalNode;
    try {
      const updatedNode = {
        id,
        pined,
        archived: false,
        _version,
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
  }, [dispatch, modalNode]);

  const onChangeCheckout = useCallback(async (): Promise<CartProps> => {
    const { id, _version } = modalNode;
    try {
      const updatedNode = {
        id,
        _version,
        checkouts: checkouts.map((checkout) => ({
          id: checkout.id,
          title: checkout.title,
          checked: checkout.checked,
        })),
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
  }, [checkouts, dispatch, modalNode]);

  const modalChangePin = useCallback(async () => {
    const data = await onChangePin();

    dispatch(getModalNode(data));
  }, [dispatch, onChangePin]);

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
    async (nodeLabels: string): Promise<CartProps> => {
      try {
        const { id, _version } = modalNode;
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

        return item;
      } catch (err) {
        throw new Error('Toggle Update Label for Carts Error');
      }
    },
    [dispatch, modalNode],
  );

  const modalToggleCartLabels = useCallback(
    async (label) => {
      const data = await toggleCartLabels(label);

      dispatch(getModalNode(data));
    },
    [dispatch, toggleCartLabels],
  );

  const onUpdate = useCallback(async () => {
    try {
      dispatch(getModalNode(undefined));
      dispatch(closeUpdateModalIsOpen());

      if (modalNode.checkouts && modalNode.checkouts.length > 0) {
        await onChangeCheckout();
      } else {
        // eslint-disable-next-line no-underscore-dangle
        await onChangeNodeContent(titleRef.current.innerText);
      }
    } catch (err) {
      throw new Error('Update cart: Something went wrong');
    }
  }, [modalNode, dispatch, onChangeNodeContent, onChangeCheckout]);

  const toggleModal = useCallback(() => {
    if (!isCartCollabaratorOpen) {
      onUpdate();
      setUpdatedColor(undefined);
    }
  }, [onUpdate, isCartCollabaratorOpen]);

  const checkoutContent = (checkout) => (
    <div className={classNames(styles.checkout_item, !checkout.focused ? styles.focused : null)}>
      <Icon
        color="premium"
        size="xs"
        onClick={() => onCheckoutChecked(checkout.id)}
        name={checkout.checked ? 'edit-bordered' : 'box'}
      />
      <input
        className={checkout.checked ? styles.checked : null}
        autoFocus={checkout.focused}
        onFocus={() => onFocusCheckouts(checkout.id)}
        onBlur={() => onFocusCheckouts(checkout.id)}
        onChange={(e) => onChangeCheckouts(checkout.id, e.target.value)}
        value={checkout.title}
        type="text"
      />
      <Icon color="premium" size="xs" name="exit" onClick={() => onRemoveCheckout(checkout.id)} />
    </div>
  );

  const selectedCheckouts = checkouts.filter((checkout) => checkout.checked);
  const unSelectedCheckouts = checkouts.filter((checkout) => !checkout.checked);

  const userEmail = localStorage.getItem('userEmail');
  const isModal = true;
  return (
    <Modal
      removeIcon={updatedColor === undefined && true}
      color={!isCartCollabaratorOpen ? updatedColor : 'default'}
      isLarge
      isOpen={updateModalIsOpen}
      cartmodal
      toggleModal={() => modalNode !== undefined && toggleModal()}
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
                <>
                  {modalNode.checkouts && modalNode.checkouts.length > 0 ? (
                    <div className={classNames(styles.checkout)}>
                      {unSelectedCheckouts.map((checkout) => checkoutContent(checkout))}
                      <div className={styles.checkout_main}>
                        <input
                          autoFocus
                          ref={mainCheckoutRef}
                          placeholder="Add your List"
                          onChange={(e) => onChangeMainCheckout(e.target.value)}
                          type="text"
                        />
                      </div>
                      {selectedCheckouts.length > 0 && (
                        <>
                          {' '}
                          <br />
                          {selectedCheckouts.length} Completed Items <br />
                          {selectedCheckouts.map((checkout) => checkoutContent(checkout))}
                        </>
                      )}
                    </div>
                  ) : (
                    <MentionContext.Provider value={() => toggleModal()}>
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
                </>
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
              onSetNode={() => toggleModal()}
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
