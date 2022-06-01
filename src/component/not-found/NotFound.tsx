import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface NotFoundProps {
  /**
   * Is main input focused
   */
  toggleIsPage: () => void;
}

const NotFound: FC<NotFoundProps> = ({ toggleIsPage }) => {
  const { t } = useTranslation();

  useEffect(() => {
    toggleIsPage();
  });

  return <div> {t('page-not-found')} </div>;
};

export default NotFound;
