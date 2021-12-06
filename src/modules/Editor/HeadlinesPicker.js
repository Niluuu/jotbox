import { Component } from 'react';
import {
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
} from '@draft-js-plugins/buttons';

class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener('click', this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  }

  onWindowClick = () => {
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.

    const { onOverrideContent } = this.props;
    onOverrideContent(undefined);
  };

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];

    return (
      <div>
        {buttons.map((Button, i) => (
          // eslint-disable jsx-props-no-spreading
          // eslint-disable-next-line react/no-array-index-key
          <Button key={i} {...this.props} />
        ))}
      </div>
    );
  }
}

export default HeadlinesPicker;
