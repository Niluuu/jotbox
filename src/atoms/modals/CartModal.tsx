/* eslint-disable react/require-default-props */
import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { API } from 'aws-amplify';
import { useSelector, useDispatch } from 'react-redux';
import Editor from '@draft-js-plugins/editor';
import classNames from 'classnames';
import { RootState } from '../../app/store';
import { closeUpdateModalIsOpen, getIdNode } from '../../reducers/getNodeId';
import styles from '../../modules/HomePage/HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import { getNode } from '../../graphql/queries';
import MainEditor from '../../modules/Editor/MainEditor';
import { updateNode } from '../../graphql/mutations';
import { InputNavbar } from '../../component/input/InputNavbar';
import '../../component/cart/Color.scss';
import { Chip } from '../../component/chip/Chip';
import MentionContext from '../../utils/hooks/useCreatContext';
import Collabarator from '../../component/Collabarator/Collabarator';

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
}

interface CartModalType {
  /**
   * Deleted Node
   */
  onRemoveCart?: (id: string, _version: number) => Promise<CartProps>;
  /**
   * Change archived attribute of Node function
   */
  onChangeArchived?: (
    id: string,
    archived: boolean,
    _version: number,
    title: string,
    description: string,
  ) => Promise<CartProps>;
  /**
   * Change pined attribute of Node function
   */
  onChangePin?: (id: string, pined: boolean, _version: number) => Promise<CartProps>;
  /**
   * Change color of Node function
   */
  onColorChange: (id: string, color: string, _version: number) => Promise<CartProps>;
  /**
   * Change collabarator of Node function
   */
  onChangeCollabarators: (
    id: string,
    _version: number,
    cartCollabarators: string[],
  ) => Promise<CartProps>;
  /**
   * Toggleselected labels when creating Node function
   */
  toggleCartLabels?: (id: string, _version: number, label: string) => Promise<CartProps>;
}

const CartModal: FC<CartModalType> = ({
  onRemoveCart,
  onChangeArchived,
  onChangePin,
  onColorChange,
  toggleCartLabels,
  onChangeCollabarators,
}) => {
  const [node, setNode] = useState<CartProps[]>([]);
  const dispatch = useDispatch();
  const editorRef = useRef<Editor>(null);
  const titleRef = useRef(null);
  const [updatedArchive, setUpdatedArchive] = useState(undefined);
  const [updatedColor, setUpdatedColor] = useState(undefined);
  const [linkMode, setlinkMode] = useState(false);
  const linkRef = useRef(null);
  const textRef = useRef(null);
  const onLinkEditor = () => {
    if (textRef.current.value.length === 0) textRef.current.focus();
    else linkRef.current.focus();
    createLinkToEditor();
  };

  const createLinkToEditor = () => setlinkMode((prev) => !prev);
  const toggleArchived = () => setUpdatedArchive((prev) => !prev);

  const onKeyPressed = (e) => {
    if (e.keyCode === 13) {
      editorRef.current!.focus();
    }
  };

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      nodeIdReducer: state.nodeIdReducer,
      editorReducer: state.editorReducer,
      isCartCollabaratorOpen: state.collabaratorReducer.isCartCollabaratorOpen,
    };
  });
  const { isCartCollabaratorOpen } = mapStateToProps;
  const { nodeID, updateModalIsOpen } = mapStateToProps.nodeIdReducer;
  const { updatedText } = mapStateToProps.editorReducer;

  const nodeGet = useCallback(async (id) => {
    try {
      const data = await API.graphql({ query: getNode, variables: { id } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      setNode([data.data.getNode]);
    } catch (err) {
      throw new Error('Node get error ');
    }
  }, []);

  useEffect(() => {
    if (node[0] !== undefined) {
      const { archived, color } = node[0];

      setUpdatedArchive(archived);
      setUpdatedColor(color);
    }
  }, [node, setUpdatedArchive]);

  useEffect(() => {
    if (nodeID.length > 0) {
      nodeGet(nodeID);
    }
  }, [nodeGet, nodeID]);

  const onUpdate = useCallback(
    async (id) => {
      try {
        const nodeDetails = {
          id,
          title: titleRef.current.innerText.toLowerCase(),
          description: updatedText,
          /* eslint no-underscore-dangle: 0 */
          _version: node[0]._version,
        };

        await API.graphql({
          query: updateNode,
          variables: { input: nodeDetails },
        });

        dispatch(getIdNode(''));
        dispatch(closeUpdateModalIsOpen());
        setNode([]);
      } catch (err) {
        throw new Error('Update cart: Something went wrong');
      }
    },
    [dispatch, node, updatedText],
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

  const modalColorChange = useCallback(
    async (color) => {
      const { id, _version } = node[0];
      const data = await onColorChange(id, color, _version);

      setNode([data]);
    },
    [node, onColorChange],
  );

  const modalChangeCollabarators = useCallback(
    async (collabarators) => {
      const { id, _version } = node[0];
      const data = await onChangeCollabarators(id, _version, collabarators);

      setNode([data]);
    },
    [node, onChangeCollabarators],
  );

  const modalToggleCartLabels = useCallback(
    async (label) => {
      const { id, _version } = node[0];
      const data = await toggleCartLabels(id, _version, label);

      setNode([data]);
    },
    [node, toggleCartLabels],
  );

  const modalChangePin = useCallback(async () => {
    const { id, _version, pined } = node[0];
    const data = await onChangePin(id, !pined, _version);

    setNode([data]);
  }, [node, onChangePin]);

  const modalRemoveCart = useCallback(() => {
    const { id, _version } = node[0];
    onRemoveCart(id, _version);

    dispatch(closeUpdateModalIsOpen());
  }, [node, onRemoveCart, dispatch]);

  const modalChangeArchived = useCallback(() => {
    const { id, _version, archived, title, description } = node[0];
    onChangeArchived(id, !archived, _version, title, description);

    dispatch(closeUpdateModalIsOpen());
  }, [dispatch, node, onChangeArchived]);

  const userEmail = localStorage.getItem('userEmail');
  return (
    <Modal
      removeIcon={updatedColor === undefined && true}
      color={updatedColor}
      isLarge
      isOpen={updateModalIsOpen}
      cartmodal
      toggleModal={() => dispatch(closeUpdateModalIsOpen())}
    >
      {node[0] !== undefined && (
        <Collabarator
          isOpen={!isCartCollabaratorOpen}
          cartCollabarators={node[0].collabarators}
          onChangeCollabarators={modalChangeCollabarators}
        />
      )}
      <>
        {node[0] !== undefined && (
          <div style={{ position: 'relative', display: isCartCollabaratorOpen && 'none' }}>
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
                {node[0].title}
              </div>

              <button type="button" className={styles.icon_btn}>
                {!node[0].pined ? (
                  <Icon name="pin" color="premium" size="xs" onClick={modalChangePin} />
                ) : (
                  <Icon name="pin-black" color="premium" size="xs" onClick={modalChangePin} />
                )}
              </button>
            </div>

            <div className={styles.main_row}>
              {nodeID && (
                <MentionContext.Provider value={() => toggleModal(node[0].id)}>
                  <MainEditor
                    linkRef={linkRef}
                    textRef={textRef}
                    linkMode={linkMode}
                    createLinkToEditor={createLinkToEditor}
                    editorRef={editorRef}
                    initialState={node[0].description}
                    color={updatedColor}
                    isModal
                  />
                </MentionContext.Provider>
              )}
              <div className={styles.main_chips}>
                {node[0].labels && node[0].labels.length > 10 ? (
                  <>
                    {node[0].labels.slice(0, 10).map((label) => (
                      <Chip onDelate={() => modalToggleCartLabels(label)}>{label}</Chip>
                    ))}
                    <div className={styles.extralabel}> +{node[0].labels.length - 10} </div>
                  </>
                ) : (
                  node[0].labels.map((label) => (
                    <Chip onDelate={() => modalToggleCartLabels(label)}>{label}</Chip>
                  ))
                )}
              </div>
              {node[0].collabarators && (
                <div className={classNames(styles.main_chips, styles.labels)}>
                  {node[0].collabarators
                    .filter((e) => e !== userEmail)
                    .map((user) => (
                      <div className={styles.user}>{user[0].toLowerCase()}</div>
                    ))}
                </div>
              )}
            </div>
            <InputNavbar
              toggleCartLabels={(label) => modalToggleCartLabels(label)}
              onColorChange={(color) => modalColorChange(color)}
              onSetNode={() => toggleModal(node[0].id)}
              onChangeArchived={modalChangeArchived}
              updateModalIsOpen={updateModalIsOpen}
              initiallabels={node[0] && node[0].labels}
              createLinkToEditor={onLinkEditor}
              onRemoveCart={modalRemoveCart}
              onSetArchive={toggleArchived}
              currentColor={node[0].color}
              selectedLabels={node[0].labels}
              shadow
            />
          </div>
        )}
      </>
    </Modal>
  );
};

export default CartModal;
