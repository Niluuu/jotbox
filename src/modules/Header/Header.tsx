import { FC } from 'react';
import styles from './Header.module.scss';
import Hamburger from './Hamburger';
import Logo from '../../component/logo/Logo';
import SearchInput from '../../component/input/SearchInput';
import { Navbar } from './Navbar';

export interface HeaderProps {
  /**
   * onclick for toggle sidebar
   */
  onClick: () => void;
}

/**
 * Main Header component for user interaction
 */

export const Header: FC<HeaderProps> = ({ onClick }) => {
  return (
    <header className={styles.header}>
      <div className={styles.header_row}>
        <Hamburger onClick={onClick} />
        <Logo />
      </div>
      <SearchInput />
      <Navbar />
    </header>
  );
};
