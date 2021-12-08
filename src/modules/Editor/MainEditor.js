import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
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
import editorStyles from './Editor.module.scss';
import { Icon } from '../../component/Icon/Icon';

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];
const text = 'The toolbar above the editor can be used for formatting text, as in conventional static editors  …';

export default class MainEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: createEditorStateWithText(text) };
  }

  componentDidMount() {
    // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      editorState: createEditorStateWithText(text),
    });
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
        <div className={editorStyles.editor} onClick={this.focus}>
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
