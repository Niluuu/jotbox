import { ReactElement, useState, useCallback, useMemo, useRef } from 'react';
import { EditorState, RichUtils, convertToRaw } from 'draft-js';
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
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import jsonBeautify from 'json-beautify';
import { linkifyPlugin } from '../../utils/editor/addLink';
import { customPlugin } from '../../utils/editor/link';
import Modal from '../../component/modal/Modal';
import mentions from './Mentions';

import styles from './Editor.module.scss';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/mention/lib/plugin.css';
import { Icon } from '../../component/Icon/Icon';

const linkPlugin = createLinkPlugin();
const hashtagPlugin = createHashtagPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;

function MainEditor(props): ReactElement {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [urlValue, seturlValue] = useState('initialState');
  const ref = useRef<Editor>(null);
  const [open, setOpen] = useState(false);
  const [focus, setfocus] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [
      mentionPlugin,
      linkifyPlugin,
      hashtagPlugin,
      customPlugin,
      inlineToolbarPlugin,
      linkPlugin,
    ];
    
    return { plugins, MentionSuggestions };
  }, []);

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(({ value }: { value: string }) => {
    setSuggestions(defaultSuggestionsFilter(value, mentions));
  }, []);

  const onURLChange = (e) => seturlValue(e.target.value);

  const promptForLink = (e) => {
    e.preventDefault();

    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      seturlValue(url);
    }
  };

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

  const onLinkInputKeyDown = (e) => {
    if (e.which === 13) {
      confirmLink(e);
    }
  };

  const removeLink = (e) => {
    e.preventDefault();

    const selection = editorState.getSelection();
    if (!selection.isCollapsed())
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
  };

  const { linkMode, onLinkMode } = props;
  const contentState = editorState.getCurrentContent();
  const raw = convertToRaw(contentState);
  const rawStr = jsonBeautify(raw, null, 2, 50);

  return (
    <div>
      {/* <pre><code>{rawStr}</code></pre> */}
      <div
        className={styles.editor}
        onClick={() => {
          ref.current!.focus();
        }}
      >
        <Editor editorState={editorState} onChange={onChange} plugins={plugins} ref={ref} />
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
          onAddMention={() => {
            // get the mention object selected
          }}
        />
      </div>
      <Modal title='Add Link' toggleModal={onLinkMode} isOpen={linkMode}>
      <div className={styles.linkWrapper}>
        <div className={styles.inputs}>
          <div className={styles.inputs_item}>
            <button type="button" onMouseDown={removeLink} onClick={() => {
              if (focus) seturlValue('')
            }}>
              <Icon name={focus ? 'delete' : 'filled-label'} color="premium" size="xs" />
            </button>
            <input
              onChange={onURLChange}
              type="text"
              placeholder='Put your Link...'
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
}

export default MainEditor;
