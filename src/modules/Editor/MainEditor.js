import React, { Component } from 'react';
import {Editor,EditorState, CompositeDecorator, RichUtils, convertToRaw} from 'draft-js';
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
import createToolbarPlugin, { Separator } from '@draft-js-plugins/static-toolbar';
import jsonBeautify from 'json-beautify'
import styles from './Editor.module.scss';

import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import { linkifyPlugin } from '../../utils/editor/addLink';
import Popover from '../../component/popover/Popover';
import Modal from '../../component/modal/Modal';

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin,linkifyPlugin];


function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
}


const Link = (props) => {
  const {contentState, entityKey, children} = props
  const {url} = contentState.getEntity(entityKey).getData();

  return ( 
    <a href={url} className={styles.link} onClick={() => window.open(url)}>
      {children}
    </a>
  );
};

export default class MainEditor extends Component {
  constructor(props) {
    super(props);   

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link
      }
    ]);

    this.state = { 
      editorState:  EditorState.createEmpty(decorator), 
      urlValue: ''
  };
  }

  onChange = (editorState) => this.setState({editorState});

  focus = () => this.editor.focus();

  logState = () => {
    const  { editorState } = this.state
    const content = editorState.getCurrentContent();
    console.log("log state",convertToRaw(content));
  };

  onURLChange = (e) => this.setState({urlValue: e.target.value});

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
      let url = "";
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }
      this.setState(
        {
          urlValue: url
        }
      );
    }
  };


  confirmLink = (e) => {
    e.preventDefault();
    console.log("confirmLink")

    const {editorState, urlValue} = this.state;
    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    
    // Apply entity
    let nextEditorState = EditorState.set(editorState, 
      { currentContent: contentStateWithEntity }
    );

    // Apply selection
    nextEditorState = RichUtils.toggleLink( nextEditorState, 
      nextEditorState.getSelection(), entityKey 
    );

    this.setState({
      editorState: nextEditorState,
      urlValue: '',
    });
  }

  onLinkInputKeyDown = (e) => { if (e.which === 13) { this.confirmLink(e); } }

  removeLink = (e) => {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  }

  render() {
    const { editorState,urlValue } = this.state;
    const { linkMode, onLinkMode } = this.props;
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    const rawStr = jsonBeautify(raw, null, 2, 50);

    return (
      <div>
        <pre><code>{rawStr}</code></pre>
        <div className={styles.editor} onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => {
              this.editor = element;
            }}
          />
          <Toolbar>
            {
              // may be use React.Fragment instead of div to improve perfomance after React 16
              (externalProps) => (
                <div>
                  <BoldButton {...externalProps} />
                  <ItalicButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <CodeButton {...externalProps} />
                  <Separator {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                  <BlockquoteButton {...externalProps} />
                  <CodeBlockButton {...externalProps} />
                </div>
              )
            }
          </Toolbar> 
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
