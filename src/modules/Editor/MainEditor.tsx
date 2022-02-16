import { FC, useState, useCallback, useEffect } from 'react';
import {
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  ContentState,
  Modifier,
  SelectionState,
  genKey,
  ContentBlock,
  CharacterMetadata,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { List, Repeat } from 'immutable';
import { setText, setUpdatedText } from '../../reducers/editor';
import Modal from '../../component/modal/Modal';
import { RootState } from '../../app/store';
import { Icon } from '../../component/Icon/Icon';
import { MentionSuggestions, plugins } from '../../utils/editor/plugin';
import styles from './Editor.module.scss';
import createMentions from '../../utils/editor/creteMention';

interface MainEditorProps {
  linkMode?: boolean;
  createLinkToEditor?: () => void;
  /**
   * Editor initial state of text
   */
  initialState?: string;
  /**
   * Editor focus ref (cannot find type)
   */
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
  /**
   * Ref to autofocus add link
   */
  linkRef?: any;
  /**
   * Ref to autofocus add link
   */
  isLarge?: boolean;
  /**
   * If editor readOnly mode
   */
  readOnly?: boolean;
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
  linkRef,
  isLarge,
  readOnly = undefined,
}) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(JSON.parse(initialState))),
  );
  const [urlValue, seturlValue] = useState('');
  const [open, setOpen] = useState(false);
  const [focus, setfocus] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [plaseHolder, setPlaseHolder] = useState(true);
  const [textLink, setTextLink] = useState('');

  const dispatch = useDispatch();

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      nodes: state.nodesReducer.nodes,
      onCreateFuncCall: state.editorReducer.onCreateFuncCall,
    };
  });

  const { nodes, onCreateFuncCall } = mapStateToProps;

  useEffect(() => {
    if (isMainInput && onCreateFuncCall) {
      setEditorState(EditorState.push(editorState, ContentState.createFromText('')));
    }
  }, [editorState, isMainInput, onCreateFuncCall]);

  useEffect(() => {
    const selectionState = editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();
    const selectedText = currentContentBlock.getText().slice(start, end);

    if (selectedText.length > 1) {
      setTextLink(selectedText);
    }
  }, [editorState]);

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
      setSuggestions(defaultSuggestionsFilter(value, createMentions(nodes), trigger));
    },
    [suggestions, nodes],
  );

  const onURLChange = (e) => seturlValue(e.target.value);

  const confirmLink = (e) => {
    e.preventDefault();

    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
        url: urlValue,
      });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      // Apply entity
      let nextEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity,
      });

      // Apply selection
      nextEditorState = RichUtils.toggleLink(
        nextEditorState,
        nextEditorState.getSelection(),
        entityKey,
      );

      setEditorState(nextEditorState);
    } else {
      const selectionState = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const currentBlock = contentState.getBlockForKey(selectionState.getStartKey());
      const currentBlockKey = currentBlock.getKey();
      const blockMap = contentState.getBlockMap();
      const blocksBefore = blockMap.toSeq().takeUntil((v) => v === currentBlock);
      const blocksAfter = blockMap
        .toSeq()
        .skipUntil((v) => v === currentBlock)
        .rest();
      const newBlockKey = genKey();

      // add new ContentBlock to editor state with appropriate text
      const newBlock = new ContentBlock({
        key: newBlockKey,
        type: 'unstyled',
        text: textLink,
        characterList: List(Repeat(CharacterMetadata.create(), textLink.length)),
      });

      const newBlockMap = blocksBefore
        .concat(
          [
            [currentBlockKey, currentBlock],
            [newBlockKey, newBlock],
          ],
          blocksAfter,
        )
        .toOrderedMap();

      const newContent = contentState.merge({
        blockMap: newBlockMap,
        selectionBefore: selection,
        selectionAfter: selection.merge({
          anchorKey: newBlockKey,
          anchorOffset: 0,
          focusKey: newBlockKey,
          focusOffset: 0,
          isBackward: false,
        }),
      });

      let newEditorState = EditorState.push(editorState, newContent, 'split-block');

      // programmatically apply selection on this text
      let newSelection = new SelectionState({
        anchorKey: newBlockKey,
        anchorOffset: 0,
        focusKey: newBlockKey,
        focusOffset: textLink.length,
      });

      newEditorState = EditorState.forceSelection(newEditorState, newSelection);

      // create link entity
      const newContentState = newEditorState.getCurrentContent();

      const contentStateWithEntity = newContentState.createEntity('LINK', 'IMMUTABLE', {
        url: urlValue,
      });

      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      newEditorState = EditorState.set(newEditorState, { currentContent: contentStateWithEntity });

      newEditorState = RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey,
      );

      // reset selection
      newSelection = new SelectionState({
        anchorKey: newBlockKey,
        anchorOffset: textLink.length,
        focusKey: newBlockKey,
        focusOffset: textLink.length,
      });

      newEditorState = EditorState.forceSelection(newEditorState, newSelection);
      setEditorState(newEditorState);
    }
    setTextLink('');
    seturlValue('');
  };

  const confirmLinkKeyUp = (e) => {
    e.preventDefault();

    if (e.key === 'Enter') {
      confirmLink(e);
      createLinkToEditor();
      setTextLink('');
    }
  };

  const removeLink = (e) => {
    e.preventDefault();

    const selection = editorState.getSelection();
    if (!selection.isCollapsed())
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
  };

  const handleChange = (e) => {
    setTextLink(e.target.value);
  };

  return (
    <div>
      <div
        className={classNames(
          styles.editor,
          isMainInput ? defaultColor : color,
          !isMainInput ? styles.cart : null,
          isLarge ? styles.large : null,
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
          readOnly={readOnly}
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

              <div>
                <input
                  type="text"
                  value={textLink}
                  readOnly={textLink.length > 1 && !true}
                  onChange={(e) => handleChange(e)}
                />
                <input
                  ref={linkRef}
                  onChange={onURLChange}
                  type="text"
                  placeholder="Put your Link..."
                  value={urlValue}
                  onFocus={() => setfocus(true)}
                  onBlur={() => setfocus(false)}
                  onKeyUp={(e) => confirmLinkKeyUp(e)}
                />
              </div>
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
