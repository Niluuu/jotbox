import { Component, useState, ReactElement, useRef } from 'react';
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
import jsonBeautify from 'json-beautify';
import { linkifyPlugin } from '../../utils/editor/addLink';
import { findLinkEntities, Link } from '../../utils/editor/link';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';

import styles from './Editor.module.scss';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';

const linkPlugin = createLinkPlugin();
const hashtagPlugin = createHashtagPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();

const { InlineToolbar } = inlineToolbarPlugin;

const customPlugin = {
  decorators: [
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ],
};

const plugins = [linkifyPlugin, hashtagPlugin, customPlugin, inlineToolbarPlugin, linkPlugin];

function MainEditor(props): ReactElement {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [urlValue, seturlValue] = useState('');
  const [focus, setfocus] = useState(false);
  const ref = useRef<Editor>(null);

  const logState = () => {
    const text = editorState.getCurrentContent().getBlocksAsArray();
    const finalText = text.map((item) => item.getText());

    console.log('finalTextt', finalText[0].slice(-2) === '[[');

    if (finalText[0].slice(-2) === '[[' || finalText[0].slice(-2) === ']]') {
      const start = finalText[0].indexOf('[[');
      const end = finalText[0].indexOf(']]');
    }
  };

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
    logState();
  };

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

  const onURLChange = (e) => {
    seturlValue(e.currentTarget.value)
  }

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

    setEditorState(nextEditorState)
    seturlValue('')
  };

  const onLinkInputKeyDown = (e) => {
    if (e.which === 13) {
      confirmLink(e);
    }
  };

  const removeLink = (e) => {
    e.preventDefault();

    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) setEditorState(RichUtils.toggleLink(editorState, selection, null))
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
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          ref={ref}
        />
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
