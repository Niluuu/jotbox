import { Component } from 'react';
import {
  EditorState,
  RichUtils,
  convertToRaw,
} from 'draft-js';
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
}

const plugins = [ linkifyPlugin, hashtagPlugin, customPlugin, inlineToolbarPlugin, linkPlugin];


export default class MainEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      urlValue: '',
    };
  }

  logState = () => {
    const { editorState, cartLink } = this.state;
    const text = editorState.getCurrentContent().getBlocksAsArray();
    const finalText = text.map((item) => item.getText());

    console.log('finalTextt', finalText[0].slice(-2) === '[[');

    if (finalText[0].slice(-2) === '[[' || finalText[0].slice(-2) === ']]') {
      const start = finalText[0].indexOf('[[');
      const end = finalText[0].indexOf(']]');
    }
  };

  onChange = (editorState) => {
    this.setState({ editorState });
    this.logState();
  };

  focus = () => this.editor.focus();

  onURLChange = (e) => this.setState({ urlValue: e.target.value });

  promptForLink = (e) => {
    e.preventDefault();
    const { editorState } = this.state;
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
      this.setState({
        urlValue: url,
      });
    }
  };

  confirmLink = (e) => {
    e.preventDefault();

    const { editorState, urlValue } = this.state;
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

    this.setState({
      editorState: nextEditorState,
      urlValue: '',
    });
  };

  onLinkInputKeyDown = (e) => {
    if (e.which === 13) {
      this.confirmLink(e);
    }
  };

  removeLink = (e) => {
    e.preventDefault();
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  };

  render() {
    const { editorState,urlValue } = this.state;
    const { linkMode, onLinkMode } = this.props;
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    const rawStr = jsonBeautify(raw, null, 2, 50);

    return (
      <div>
        {/* <pre><code>{rawStr}</code></pre> */}
        <div className={styles.editor} onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => {
              this.editor = element;
            }}
          />
          <InlineToolbar >
            {
              (externalProps) => (
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
              )
            }
          </InlineToolbar> 
        </div>  
        <Modal isOpen={linkMode}>
          <div className={styles.linkWrapper}>
            <div className={styles.inputs}>
              <input
                onChange={this.onURLChange}
                type="text"
                value={urlValue}
                onKeyDown={this.onLinkInputKeyDown}
              />
              <button type="button" onClick={onLinkMode} onMouseDown={this.confirmLink}> Confirm </button> 
            </div>
            <div className={styles.buttons}>
              <button
                type="button"
                onMouseDown={this.promptForLink}>
                Add Link
              </button>
              <button type="button" onMouseDown={this.removeLink}>
                Remove Link
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
