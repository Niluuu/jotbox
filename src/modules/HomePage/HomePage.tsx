import { FC } from 'react';
import classNames from 'classnames';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from './CartLayout';

export interface HomePageProps {
  gridType: boolean;
}

const HomePage: FC<HomePageProps> = ( { gridType } ) => {
  return (
    <div className={classNames(styles.home_page, gridType ? styles.grid4: null)}>
      <div className={styles.home_page__main_input}>
        <MainInput gridType={gridType}/>
      </div>
      <CartLayout gridType={gridType} />
    </div>
  );
};

export default HomePage;
