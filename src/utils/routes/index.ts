export const getLabels = (labels: any[]) => {
  const result = labels
    ? labels.map((label) => ({
        id: label.id,
        name: label.title,
        url: `/gaps/${label.title}`,
        icon: 'notes',
      }))
    : [];

  return result;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const routes = (labels: any[]) => {
  const result = [
    { name: 'Заметки', gaps: null, icon: 'notes', active: true, url: '/', modal: false },
    { name: 'Изменение ярлыков', gaps: null, icon: 'labels', url: '/*', modal: true },
    {
      name: 'gaps',
      icon: null,
      active: false,
      url: '',
      modal: null,
      gaps: getLabels(labels),
    },
    { name: 'Архив', gaps: null, icon: 'archive', active: false, url: '/archives', modal: false },
    { name: 'Корзина', gaps: null, icon: 'basket', active: false, url: '/trash', modal: false },
  ];

  return result;
};
