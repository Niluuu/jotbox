import { getNodes } from '../../api/getNode';

export const filterByLetter = async (value, setFilterLetter) => {
  setFilterLetter(value);
  const nodes = getNodes();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //  @ts-ignore
  const filteredNodesByLetter = nodes.filter(
    (todo) =>
      todo.description.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0 ||
      todo.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0,
  );

  // return filteredNodesByLetter;
};
