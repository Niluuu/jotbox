import React, { Component } from 'react';
import HeadlinesPicker from './HeadlinesPicker';
import editorStyles from './Editor.module.scss';

class HeadlinesButton extends Component {
  // When using a click event inside overridden content, mouse down
  // events needs to be prevented so the focus stays in the editor
  // and the toolbar remains visible  onMouseDown = (event) => event.preventDefault()
  onMouseDown = (event) => event.preventDefault();

  onClick = () => {
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    // eslint-disable jsx-props-no-spreading
    // eslint-disable-next-line react/no-array-index-key
    const { onOverrideContent } = this.prop;
    onOverrideContent(HeadlinesPicker);
  };

  render() {
    return (
      <div onMouseDown={this.onMouseDown} className={editorStyles.headlineButtonWrapper}>
        <button type="button" onClick={this.onClick} className={editorStyles.headlineButton}>
          H
        </button>
      </div>
    );
  }
}

export default HeadlinesButton;
