const Link = (props) => {
    const {contentState, entityKey, children} = props
    const {url} = contentState.getEntity(entityKey).getData();
  
    return ( 
      <a href={url} className={styles.link} onClick={() => window.open(url)}>
        {children}
      </a>
    );
  };

export default Link