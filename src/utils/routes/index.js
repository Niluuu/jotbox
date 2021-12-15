export const gapRoutes = (gaps) => {
  const gapLabels = gaps
    ? gaps.map((gap) => ({
        name: gap,
        url: `/gap/${gap}`,
        icon: 'notes',
      }))
    : [];

  return gapLabels;
};

export const routes = (labels) => {
  const allRoutes = [
    { name: 'Заметки', gaps: null, icon: 'notes', active: true, url: '/', modal: false },
    { name: 'Изменение ярлыков', gaps: null, icon: 'labels', url: '/*', modal: true },
    {
      name: 'gaps',
      icon: null,
      active: null,
      url: null,
      modal: null,
      gaps: gapRoutes(labels),
    },
    { name: 'Архив', gaps: null, icon: 'archive', active: false, url: '/archives', modal: false },
    { name: 'Корзина', gaps: null, icon: 'basket', active: false, url: '/trash', modal: false },
  ];
  return allRoutes;
};
