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

const CartModal: FC = () => {
  const [node, setNode] = useState([]);
  const dispatch = useDispatch();
  const editorRef = useRef<Editor>(null);
  const titleRef = useRef(null);
  const [updatedPined, setUpdatedPined] = useState(undefined);
  const [updatedArchive, setUpdatedArchive] = useState(undefined);
  const [updatedColor, setUpdatedColor] = useState(undefined);
  const [linkMode, setlinkMode] = useState(false);

  const createLinkToEditor = () => setlinkMode((prev) => !prev);
  const togglePined = () => setUpdatedPined((prev) => !prev);
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
      const { pined, archived, color } = node[0];

      setUpdatedPined(pined);
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
          title: titleRef.current.innerText,
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

  return (
    <Modal
      removeIcon={updatedColor === undefined && true}
      color={updatedColor}
      isLarge={!!true}
      isOpen={updateModalIsOpen}
      toggleModal={() => toggleModal(node[0].id)}
    >
      <>
        {node[0] !== undefined && (
          <div tabIndex={-1} style={{position: 'relative'}}>
            <div
              className={updatedColor}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '95%',
                padding: '10px',
                position: 'absolute',
                zIndex: 1,
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
                  <Icon name="pin" color="premium" size="xs" onClick={togglePined} />
                ) : (
                  <Icon name="pin-black" color="premium" size="xs" onClick={togglePined} />
                )}
              </button>
            </div>

            <div className={styles.main_row}>
              {nodeID && (
                <MainEditor
                  linkMode={linkMode}
                  createLinkToEditor={createLinkToEditor}
                  editorRef={editorRef}
                  initialState={node[0].description}
                  color={updatedColor}
                  isModal
                />
              )}
            </div>
            <InputNavbar
              isMainInput={!!true}
              onSetArchive={toggleArchived}
              onSetNode={() => toggleModal(node[0].id)}
              createLinkToEditor={createLinkToEditor}
              withHistory
              selectedGaps={[]}
              shadow
              initialGaps={node[0] && node[0].gaps}
            />
          </div>
        )}
      </>
    </Modal>
  );
};

export default CartModal;
