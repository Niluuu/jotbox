import { RichUtils } from 'draft-js';
import styles from '../../component/tooltip/Tooltip.module.scss';

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
}

const Link = (props) => {
  const { contentState, entityKey, children } = props;
  const { url } = contentState.getEntity(entityKey).getData();

  const removeLink = () => {
    console.log('remove');
  };

  return (
    <div className={styles.linkfy}>
      <div className={styles.tooltip}>
        <span onClick={() => window.open(url)}>open</span>
        <br />
        <span onClick={() => removeLink()}>
          <span>remove</span>
        </span>
      </div>
      <a href={url} className={styles.link}>
        {children}
      </a>
    </div>
  );
};

export const customPlugin = {
  decorators: [
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ],
};
