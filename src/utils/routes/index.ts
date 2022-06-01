type LabelType = {
  id: string;
  _version: number;
  title: string;
};

type GetLabelType = {
  id: string;
  name: string;
  url: string;
  icon: string;
};

type RoutesType = {
  name: string;
  url: string;
  icon: string;
  active?: boolean;
  modal: boolean | null;
  labels: GetLabelType[] | null;
};

export const getLabels = (labels: LabelType[]): GetLabelType[] => {
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

export const routes = (labels: LabelType[]): RoutesType[] => {
  const result = [
    { name: 'notes', labels: null, icon: 'notes', active: true, url: '/', modal: false },
    { name: 'edit-labels', labels: null, icon: 'labels', url: '/*', modal: true },
    {
      name: 'labels',
      icon: null,
      active: false,
      url: '',
      modal: null,
      labels: getLabels(labels),
    },
    {
      name: 'archive',
      labels: null,
      icon: 'archive',
      active: false,
      url: '/archived',
      modal: false,
    },
  ];

  return result;
};
