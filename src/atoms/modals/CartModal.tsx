import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { API } from 'aws-amplify';
import { useSelector, useDispatch } from 'react-redux';
import Editor from '@draft-js-plugins/editor';
import { RootState } from '../../app/store';
import { closeUpdateModalIsOpen } from '../../reducers/nodes';
import styles from '../../modules/HomePage/HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import { getNode } from '../../graphql/queries';
import MainEditor from '../../modules/Editor/MainEditor';
import { updateNode } from '../../graphql/mutations';
import { InputNavbar } from '../../component/input/InputNavbar';

const CartModal: FC = () => {
  const [node, setNode] = useState([]);
  const dispatch = useDispatch();
  const editorRef = useRef<Editor>(null);
  const titleRef = useRef(null);
  const [updatedPined, setUpdatedPined] = useState(undefined);
  const [updatedArchive, setUpdatedArchive] = useState(undefined);
  const [updatedColor, setUpdatedColor] = useState(undefined);
  const [linkMode, setlinkMode] = useState(false);

  const onLinkMode = () => setlinkMode((prev) => !prev);
  const togglePined = () => setUpdatedPined((prev) => !prev);
  const toggleArchived = () => setUpdatedArchive((prev) => !prev);

  const onKeyPressed = (e) => {
    if (e.keyCode === 13) {
      editorRef.current!.focus();
    }
  };

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      nodesReducer: state.nodesReducer,
      editorReducer: state.editorReducer,
    };
  });
  const { nodeID, updateModalIsOpen } = mapStateToProps.nodesReducer;
  const { updatedText } = mapStateToProps.editorReducer;

  const nodeGet = useCallback(
    async (id) => {
      try {
        const data = await API.graphql({ query: getNode, variables: { id } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        setNode([data.data.getNode]);
      } catch (err) {
        console.log(err);
      }
    },
    [nodeID],
  );

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
  }, [nodeID]);

  const onUpdate = useCallback(async () => {
    try {
      const nodeDetails = {
        id: nodeID,
        title: titleRef.current.innerText,
        description: updatedText,
        /* eslint no-underscore-dangle: 0 */
        _version: node[0]._version,
      };

      await API.graphql({
        query: updateNode,
        variables: { input: nodeDetails },
      });
    } catch (err) {
      throw new Error('Update cart: Something went wrong');
    }
  }, [nodeID, titleRef, updatedPined, updatedText]);

  const toggleModal = useCallback(() => {
    dispatch(closeUpdateModalIsOpen());
    onUpdate();
  }, [nodeID, titleRef, updatedPined, updatedText]);

  return (
    <Modal
      removeIcon={updatedColor === undefined && true}
      color={updatedColor}
      isLarge={!!true}
      isOpen={updateModalIsOpen}
    >
      <>
        {node[0] !== undefined && (
          <div tabIndex={-1}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
              <MainEditor
                linkMode={linkMode}
                onLinkMode={onLinkMode}
                editorRef={editorRef}
                initialState={node[0].description}
                color={updatedColor}
              />
            </div>
            <InputNavbar
              isMainInput={!!true}
              onSetArchive={toggleArchived}
              ontoggle={toggleModal}
              onLinkMode={onLinkMode}
              withHistory
              selectedGaps={[]}
            />
          </div>
        )}
      </>
    </Modal>
  );
};

export default CartModal;
