/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import styles from '../../component/tooltip/Tooltip.module.scss';

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
};

const Link = (props) => {
  const { contentState, entityKey, children } = props;
  const { url, linkText } = contentState.getEntity(entityKey).getData();

  return (
    <div className={styles.linkfy}>
      <div className={styles.tooltip}>
        <span contentEditable="false" onClick={() => window.open(url)}>
          Open
        </span>
        <br />
      </div>
      <a href={url} className={styles.link}>
        {linkText || children}
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
