import { FC } from 'react';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from './CartLayout';

interface HomePageProps {
  isLogin?: boolean;
}

const HomePage: FC<HomePageProps> = ({ isLogin }) => {
  return (
    <div className={styles.home_page}>
      <div className={styles.home_page__main_input}>
        <MainInput />
      </div>
      <CartLayout />
    </div>
  );
};

export default HomePage;
