const createMentions = (nodes) => {
  const mention = [];

  nodes.filter(
    // eslint-disable-next-line no-underscore-dangle
    (node) => node._deleted !== true && mention.push({ name: node.title, link: node.id, key: `mention-${node.id}` }),
  );

  return mention;
};

export default createMentions;
