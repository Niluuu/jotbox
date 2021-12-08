import React, { Component } from 'react';
import {EditorState} from 'draft-js';
import Editor, { createEditorStateWithText, createEmpty } from '@draft-js-plugins/editor';
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

import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import styles from './Editor.module.scss';
import { linkifyPlugin } from '../../utils/editor/addLink';

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin,linkifyPlugin];

export default class MainEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState:  EditorState.createEmpty()};
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    const { editorState } = this.state;
    const { onSetArchive, focusEdit } = this.props;
    if (focusEdit) {
      this.editor.focus()
    }
    return (
      <div>
        <div className={styles.editor} onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => {
              this.editor = element;
            }}
          />
          <div className={editorStyles.custom}>
            <button type="button" className={editorStyles.icon_btn}>
              <Icon name="notification-add" color="premium" size="xs" />
            </button>
            <button type="button" className={editorStyles.icon_btn}>
              <Icon name="user-add" color="premium" size="xs" />
            </button>
            <button type="button" className={editorStyles.icon_btn}>
              <Icon name="img" color="premium" size="xs" />
            </button>
            <button onClick={onSetArchive} type="button" className={editorStyles.icon_btn}>
              <Icon name="dowland" color="premium" size="xs" />
            </button>
          </div>
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
      </div>
    );
  }
}
