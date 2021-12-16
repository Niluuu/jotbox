import createHashtagPlugin from '@draft-js-plugins/hashtag';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createMentionPlugin from '@draft-js-plugins/mention';
import { linkifyPlugin } from './addLink';
import { customPlugin } from './link';

import '@draft-js-plugins/hashtag/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/mention/lib/plugin.css';

const hashtagPlugin = createHashtagPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
export const linkPlugin = createLinkPlugin();
export const { InlineToolbar } = inlineToolbarPlugin;

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
  mentionPlugin,
  linkifyPlugin,
  hashtagPlugin,
  customPlugin,
  inlineToolbarPlugin,
  linkPlugin,
];
