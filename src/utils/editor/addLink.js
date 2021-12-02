import createLinkifyPlugin from '@draft-js-plugins/linkify';
import linkifyIt from 'linkify-it';
import tlds from 'tlds';

export const linkifyPlugin = createLinkifyPlugin({
  component(props) {
    // eslint-disable-next-line no-alert, jsx-a11y/anchor-has-content
    // eslint-disable jsx-props-no-spreading
    /* eslint-disable react/jsx-props-no-spreading */
    return <a {...props} onClick={() => window.open('Clicked on Link!')} />;
  },

  customExtractLinks: (text) => linkifyIt().tlds(tlds).set({ fuzzyEmail: false }).match(text),
});
