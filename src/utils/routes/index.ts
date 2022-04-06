export const getLabels = (labels: any[]) => {
  const result = labels
    ? labels.map((label) => ({
        id: label.id,
        name: label.title,
        url: `/labels/${label.title}`,
        icon: 'labels',
      }))
    : [];

  return result;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const routes = (labels: any[]) => {
  const result = [
    { name: 'Заметки', labels: null, icon: 'notes', active: true, url: '/', modal: false },
    { name: 'Изменение ярлыков', labels: null, icon: 'labels', url: '/*', modal: true },
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
      url: '/archived',
      modal: false,
    },
  ];

  return result;
};
