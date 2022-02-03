import { FC } from 'react';
import styles from './Preloader.module.scss';
import preloaderGif from '../../assets/images/Preloader.gif';

export const Preloader: FC = () => {
  return <img className={styles.preloader} src={preloaderGif} alt="" />;
};
