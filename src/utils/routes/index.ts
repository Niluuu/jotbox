export const getLabels = (labels: any[]) => {
  const result = labels
    ? labels.map((label) => ({
        id: label.id,
        name: label.title,
        url: `/notes/labels/${label.title}`,
        icon: 'labels',
      }))
    : [];

  return result;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const routes = (labels: any[]) => {
  const result = [
    { name: 'Заметки', labels: null, icon: 'notes', active: true, url: '/notes', modal: false },
    { name: 'Изменение ярлыков', labels: null, icon: 'labels', url: '/notes/*', modal: true },
    {
      name: 'labels',
      icon: null,
      active: false,
      url: '',
      modal: null,
      labels: getLabels(labels),
    },
    {
      name: 'Архив',
      labels: null,
      icon: 'archive',
      active: false,
      url: '/notes/archive',
      modal: false,
    },
  ];

  return result;
};
