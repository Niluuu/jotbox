import createHashtagPlugin from '@draft-js-plugins/hashtag';
import createMentionPlugin from '@draft-js-plugins/mention';
import createAutoListPlugin from 'draft-js-autolist-plugin'
import { linkifyPlugin } from './addLink';
import { customPlugin } from './link';

import '@draft-js-plugins/hashtag/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/mention/lib/plugin.css';

const autoListPlugin = createAutoListPlugin()
const hashtagPlugin = createHashtagPlugin();

const mentionPlugin = createMentionPlugin({
  mentionComponent(mentionProps) {
    const { children } = mentionProps;
    return (
      <span
        // eslint-disable-next-line no-alert
        onClick={() => alert('Clicked on the Mention!')}
      >
          [{children}]
      </span>
    );
  },
  entityMutability: 'IMMUTABLE',
  mentionTrigger: ['['],
  supportWhitespace: true,
});
// eslint-disable-next-line no-shadow
export const { MentionSuggestions } = mentionPlugin;
// eslint-disable-next-line no-shadow
export const plugins = [
  autoListPlugin,
  mentionPlugin,
  linkifyPlugin,
  hashtagPlugin,
  customPlugin,
];
