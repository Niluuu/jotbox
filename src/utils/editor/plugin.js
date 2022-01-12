import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import createMentionPlugin from '@draft-js-plugins/mention';
import createAutoListPlugin from 'draft-js-autolist-plugin';
import { linkifyPlugin } from './addLink';
import { customPlugin } from './link';

import '@draft-js-plugins/hashtag/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/mention/lib/plugin.css';

import styles from '../../component/tooltip/Tooltip.module.scss';

const autoListPlugin = createAutoListPlugin();
const hashtagPlugin = createHashtagPlugin();

const mentionPlugin = createMentionPlugin({
  mentionComponent(mentionProps) {
    const { children, mention } = mentionProps;
    // const useThunkDispatch =  useDispatch();

    const onOpenModal = (nodeId) => {
      alert(`${nodeId}`);
    };

    return (
      <div className={classNames(styles.linkfy, styles.link)}>
        <span>[[{children}]]</span>
        <div className={styles.tooltip}>
          <span onClick={() => onOpenModal(mention.link)}>
            <span>open</span>
          </span>
        </div>
      </div>
    );
  },
  entityMutability: 'IMMUTABLE',
  mentionTrigger: ['[['],
  supportWhitespace: true,
});
// eslint-disable-next-line no-shadow
export const { MentionSuggestions } = mentionPlugin;
// eslint-disable-next-line no-shadow
export const plugins = [autoListPlugin, mentionPlugin, linkifyPlugin, hashtagPlugin, customPlugin];
