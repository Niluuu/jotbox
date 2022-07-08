import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface NotFoundProps {
  toggleIsPage: () => void; // Is main input focused
}

const NotFound: FC<NotFoundProps> = ({ toggleIsPage }) => {
  const { t } = useTranslation();

  useEffect(() => {
    toggleIsPage();
  });

  return <div> {t('page-not-found')} </div>;
};

export default NotFound;
