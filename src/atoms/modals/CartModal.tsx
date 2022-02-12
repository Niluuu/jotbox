import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { API } from 'aws-amplify';
import { useSelector, useDispatch } from 'react-redux';
import Editor from '@draft-js-plugins/editor';
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

interface CartModalType {
  /**
   * Deleted Node
   */
  onRemoveCart?: (id: string, _version: number) => void;
  /**
   * Change archived attribute of Node function
   */
  onChangeArchived?: (
    id: string,
    archived: boolean,
    _version: number,
    title: string,
    description: string,
  ) => void;
  /**
   * Change pined attribute of Node function
   */
  onChangePin?: (id: string, pined: boolean, _version: number) => void;
  /**
   * Change color of Node function
   */
  onColorChange: (id: string, color: string, _version: number) => void;
  /**
   * Toggleselected gaps when creating Node function
   */
  toggleGapsCart?: (id: string, _version: number, gap: any) => void;
}

const CartModal: FC<CartModalType> = ({
  onRemoveCart,
  onChangeArchived,
  onChangePin,
  onColorChange,
  toggleGapsCart,
}) => {
  const [node, setNode] = useState<any>([]);
  const dispatch = useDispatch();
  const editorRef = useRef<Editor>(null);
  const titleRef = useRef(null);
  const [updatedArchive, setUpdatedArchive] = useState(undefined);
  const [updatedColor, setUpdatedColor] = useState(undefined);
  const [linkMode, setlinkMode] = useState(false);

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
    };
  });
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
  }, [node]);

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
      onUpdate(id);
      setUpdatedColor(undefined);
    },
    [onUpdate],
  );

  const modalColorChange = useCallback(
    (color) => {
      const { id, _version } = node[0];
      const data = onColorChange(id, color, _version);

      setNode([data]);
    },
    [node, onColorChange],
  );

  const modalToggleGapsCart = useCallback(
    (gap) => {
      const { id, _version } = node[0];
      const data = toggleGapsCart(id, _version, gap);

      setNode([data]);
    },
    [node, toggleGapsCart],
  );

  const modalChangePin = useCallback(() => {
    const { id, _version, pined } = node[0];
    const data = onChangePin(id, !pined, _version);

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
  }, [node, onChangeArchived, dispatch]);

  return (
    <Modal
      removeIcon={updatedColor === undefined && true}
      color={updatedColor}
      isLarge
      isOpen={updateModalIsOpen}
      cartmodal
      toggleModal={() => toggleModal(node[0].id)}
    >
      <>
        {node[0] !== undefined && (
          <div tabIndex={-1} style={{ position: 'relative' }}>
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
                {node[0].gaps && node[0].gaps.length > 10 ? (
                  <>
                    {node[0].gaps.slice(0, 10).map((gap) => (
                      <Chip onDelate={() => modalToggleGapsCart(gap)}>{gap}</Chip>
                    ))}
                    <div className={styles.extraGap}> +{node[0].gaps.length - 10} </div>
                  </>
                ) : (
                  node[0].gaps.map((gap) => (
                    <Chip onDelate={() => modalToggleGapsCart(gap)}>{gap}</Chip>
                  ))
                )}
              </div>
            </div>
            <InputNavbar
              toggleGapsCart={(gap) => modalToggleGapsCart(gap)}
              onColorChange={(color) => modalColorChange(color)}
              onSetNode={() => toggleModal(node[0].id)}
              createLinkToEditor={createLinkToEditor}
              onChangeArchived={modalChangeArchived}
              onRemoveCart={modalRemoveCart}
              onSetArchive={toggleArchived}
              currentColor={node[0].color}
              initialGaps={node[0] && node[0].gaps}
              selectedGaps={node[0].gaps}
              shadow
            />
          </div>
        )}
      </>
    </Modal>
  );
};

export default CartModal;
