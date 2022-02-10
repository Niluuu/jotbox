import { FC, useState, useCallback, useEffect } from 'react';
import { EditorState, RichUtils, convertFromRaw, convertToRaw, ContentState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { setText, setUpdatedText } from '../../reducers/editor';
import Modal from '../../component/modal/Modal';
import { RootState } from '../../app/store';
import { Icon } from '../../component/Icon/Icon';
import { MentionSuggestions, plugins } from '../../utils/editor/plugin';
import styles from './Editor.module.scss';

interface MainEditorProps {
  linkMode?: boolean;
  createLinkToEditor?: () => void;
  initialState?: string;
  editorRef?: any;
  /**
   * Color of Editor in Cart
   */
  color?: string;
  /**
   * Color of Editor in MainInput
   */
  defaultColor?: string;
  /**
   * Should editor appear in MainInput?
   */
  isMainInput?: boolean;
  /**
   * Should editor appear in Modal?
   */
  isModal?: boolean;
}

const MainEditor: FC<MainEditorProps> = ({
  linkMode,
  createLinkToEditor,
  initialState,
  editorRef,
  color,
  defaultColor,
  isMainInput,
  isModal,
}) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(JSON.parse(initialState))),
  );
  const [urlValue, seturlValue] = useState('');
  const [open, setOpen] = useState(false);
  const [focus, setfocus] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [plaseHolder, setPlaseHolder] = useState(true);
  const dispatch = useDispatch();

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      nodes: state.nodesReducer.nodes,
      onCreateFuncCall: state.editorReducer.onCreateFuncCall,
    };
  });

  const { nodes, onCreateFuncCall } = mapStateToProps;

  const convertNodesToSuggestions = useCallback((listNodes) => {
    const mention = [];

    listNodes.filter(
      // eslint-disable-next-line no-underscore-dangle
      (node) => node._deleted !== true && mention.push({ name: node.title, link: node.id }),
    );

    return mention;
  }, []);

  useEffect(() => {
    if (isMainInput && onCreateFuncCall)
      setEditorState(EditorState.push(editorState, ContentState.createFromText('')));
  }, [editorState, isMainInput, onCreateFuncCall]);

  useEffect(() => {
    const mention = convertNodesToSuggestions(nodes);
    setSuggestions(mention);
  }, [nodes, convertNodesToSuggestions]);

  const onChange = useCallback(
    (newEditorState) => {
      setPlaseHolder(false);
      setEditorState(newEditorState);

      const convert = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));

      if (initialState) dispatch(setUpdatedText(convert));
      dispatch(setText(convert));
    },
    [dispatch, initialState],
  );

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(
    ({ trigger, value }: { trigger: string; value: string }) => {
      setSuggestions(defaultSuggestionsFilter(value, suggestions, trigger));
    },
    [suggestions],
  );

  const onURLChange = (e) => seturlValue(e.target.value);

  const confirmLink = (e) => {
    e.preventDefault();

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url: urlValue });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    // Apply entity
    let nextEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    // Apply selection
    nextEditorState = RichUtils.toggleLink(
      nextEditorState,
      nextEditorState.getSelection(),
      entityKey,
    );

    setEditorState(nextEditorState);
    seturlValue('');
  };

  const removeLink = (e) => {
    e.preventDefault();

    const selection = editorState.getSelection();
    if (!selection.isCollapsed())
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
  };

  return (
    <div>
      <div
        className={classNames(
          styles.editor,
          isMainInput ? defaultColor : color,
          !isMainInput ? styles.cart : null,
          isModal ? styles.modal : null,
        )}
        onClick={() => {
          editorRef.current!.focus();
        }}
      >
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          ref={editorRef}
          placeholder={plaseHolder ? 'Заметка...' : null}
        />
        <MentionSuggestions
          open={open}
          onOpenChange={onOpenChange}
          suggestions={suggestions}
          onSearchChange={onSearchChange}
        />
      </div>
      <Modal title="Add Link" toggleModal={createLinkToEditor} isOpen={linkMode}>
        <div className={styles.linkWrapper}>
          <div className={styles.inputs}>
            <div className={styles.inputs_item}>
              <button
                type="button"
                onMouseDown={removeLink}
                onClick={() => {
                  if (focus) seturlValue('');
                }}
              >
                <Icon name={focus ? 'delete' : 'filled-label'} color="premium" size="xs" />
              </button>
              <input
                onChange={onURLChange}
                type="text"
                placeholder="Put your Link..."
                value={urlValue}
                onFocus={() => setfocus(true)}
                onBlur={() => setfocus(false)}
              />
              <button onMouseDown={confirmLink} onClick={createLinkToEditor} type="button">
                <Icon name={focus ? 'done' : 'edit'} color="premium" size="xs" />
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MainEditor;
