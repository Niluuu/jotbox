import { FC, useState, useCallback, useRef } from 'react';
import { EditorState, RichUtils, convertFromRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons';
import { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import Modal from '../../component/modal/Modal';
import mentions from './Mentions';
import { Icon } from '../../component/Icon/Icon';
import { InlineToolbar, MentionSuggestions, plugins, linkPlugin } from '../../utils/editor/plugin';

import styles from './Editor.module.scss';

interface MainEditorProps {
  linkMode?: any;
  onLinkMode?: any;
  initialState?: any;
  editorRef?: any;
}

const MainEditor: FC<MainEditorProps> = ({ linkMode, onLinkMode, initialState, editorRef }) => {
  const state = initialState ? EditorState.createWithContent(convertFromRaw({
    blocks: [
      {
        key: "cbbnn",
        text: "sdasdasda",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {}
      }
    ],
    entityMap: {}
  })) : EditorState.createEmpty()

  const [editorState, setEditorState] = useState(state);
  const [urlValue, seturlValue] = useState('');
  const [open, setOpen] = useState(false);
  const [focus, setfocus] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

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
      <div
        className={styles.editor}
        onClick={() => {
          editorRef.current!.focus();
        }}
      >
        <Editor editorState={editorState} onChange={onChange} plugins={plugins} ref={editorRef} />
        <InlineToolbar>
          {(externalProps) => (
            <>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <CodeButton {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              <BlockquoteButton {...externalProps} />
              <CodeBlockButton {...externalProps} />
              <linkPlugin.LinkButton {...externalProps} />
            </>
          )}
        </InlineToolbar>
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
