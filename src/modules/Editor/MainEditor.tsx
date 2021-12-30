import { FC, useState, useCallback } from 'react';
import { EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { RootState } from '../../app/store';
import { setText, setUpdatedText } from '../../reducers/editor';
import Modal from '../../component/modal/Modal';
import mentions from './Mentions';
import { Icon } from '../../component/Icon/Icon';
import { MentionSuggestions, plugins } from '../../utils/editor/plugin';

import styles from './Editor.module.scss';

interface MainEditorProps {
  linkMode?: any;
  onLinkMode?: any;
  initialState?: any;
  editorRef?: any;
  color?: string;
  defaultColor?: string;
  isMainInput?: boolean;
}

const MainEditor: FC<MainEditorProps> = 
  ({ linkMode, onLinkMode, initialState, editorRef, color, defaultColor, isMainInput }) => {
  const initalEditorState = initialState
    ? EditorState.createWithContent(convertFromRaw(JSON.parse(initialState)))
    : EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initalEditorState);
  const [urlValue, seturlValue] = useState('');
  const [open, setOpen] = useState(false);
  const [focus, setfocus] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);
  const [plaseHolder, setPlaseHolder] = useState(true);
  const dispatch = useDispatch();

  const onChange = useCallback(
    (newEditorState) => {
      setPlaseHolder(false)
      setEditorState(newEditorState);

      const convert = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
      
      if (initialState) dispatch(setUpdatedText(convert));
      dispatch(setText(convert));

    },
    [editorState],
  );

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(({ trigger, value }: { trigger: string; value: string }) => {
    setSuggestions(defaultSuggestionsFilter(value, mentions, trigger));
  }, []);

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
      <div className={classNames(
        styles.editor, isMainInput ? defaultColor : color, 
          !isMainInput ? styles.cart: null
        )}
        onClick={() => {
          editorRef.current!.focus();
        }}
      >
        <Editor editorState={editorState} onChange={onChange} plugins={plugins} ref={editorRef} placeholder={plaseHolder ? "Заметка...": null} />
        <MentionSuggestions
          open={open}
          onOpenChange={onOpenChange}
          suggestions={suggestions}
          onSearchChange={onSearchChange}
        />
      </div>
      <Modal title="Add Link" toggleModal={onLinkMode} isOpen={linkMode}>
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
              <button onMouseDown={confirmLink} onClick={onLinkMode} type="button">
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
