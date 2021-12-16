const gapFilter = (nodes) => {
  const gapCategories = Array.from(nodes.flatMap(({ gaps }) => gaps));
  
  return Object.keys(Object.fromEntries(
    gapCategories.map((category) => [
      category, nodes.filter((node) => node.gaps && node.gaps.includes(category))
    ])
  ));
}

export default gapFilter;