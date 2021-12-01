export const gapCategories = (nodes) => {
  return nodes.reduce(({ gaps}) => gaps, [])
};

export const filteredGaps = (nodes) => {
  const categorys = gapCategories(nodes);
  const gaps = Object.keys(
    Object.fromEntries(
      categorys.map((category) => [
        category,
        nodes.filter((node) => node.gaps && node.gaps.includes(category)),
      ]),
    ),
  );

  return gaps;
};
