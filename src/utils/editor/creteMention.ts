interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  labels: string[];
  _version: number;
  _deleted: boolean;
  color: string;
  collabarators: string[];
  collabarator: string;
}

interface createMentionsType {
  name: string;
  link: string;
  key: string;
}

const createMentions = (nodes: CartProps[]): createMentionsType[] => {
  const mention = [];

  nodes.filter(
    (node) =>
      // eslint-disable-next-line no-underscore-dangle
      node._deleted !== true &&
      mention.push({ name: node.title, link: node.id, key: `mention-${node.id}` }),
  );

  return mention;
};

export default createMentions;
