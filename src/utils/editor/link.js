import styles from '../../modules/Editor/Editor.module.scss';


export function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
}


export const Link = (props) => {
  const {contentState, entityKey, children} = props
  const {url} = contentState.getEntity(entityKey).getData();

  return ( 
    <a href={url} className={styles.link} onClick={() => window.open(url)}>
      {children}
    </a>
  );
};