import createLinkifyPlugin from '@draft-js-plugins/linkify';
import linkifyIt from 'linkify-it';
import tlds from 'tlds';
import styles from '../../component/tooltip/Tooltip.module.scss';

export const linkifyPlugin = createLinkifyPlugin({
  component(props) {
    return (
      <div className={styles.linkfy}>
        <div className={styles.tooltip}>
          <span onClick={() => window.open(props.href)}>
            <span>open</span>
          </span>
        </div>
        <a
          {...props}
          className={styles.link}
        />
      </div>
    );
  },

  customExtractLinks: (text) =>
    linkifyIt()
      .tlds(tlds)
      .set({ fuzzyEmail: false })
      .match(text),
});
