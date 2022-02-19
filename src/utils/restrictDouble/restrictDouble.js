// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const restrictDouble = (array) => {
  const newArray = new Set();
  const filtered = array.filter((item) => {
    const duplicate = newArray.has(item.title);
    newArray.add(item.title);
    return !duplicate;
  });

  return filtered;
};

export default restrictDouble;
