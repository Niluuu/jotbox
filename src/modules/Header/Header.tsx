import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Header.module.scss';
import Hamburger from './Hamburger';
import Logo from '../../component/logo/Logo';
import SearchInput from '../../component/input/SearchInput';
import Popover from '../../component/popover/Popover';
import { Icon } from '../../component/Icon/Icon';
import { Navbar } from './Navbar';

export interface HeaderProps {
  isLoggedIn?: boolean;
  gridType: boolean;
  /**
   * onclick for toggle sidebar
   */
  onClick: () => void;
  filterByLetter: (value: string) => void;
  filterLetter: any;
  changeGrid: () => void;
}

/**
 * Main Header component for user interaction
 */

export const Header: FC<HeaderProps> = ({ isLoggedIn, filterByLetter, filterLetter, onClick, changeGrid, gridType }) => {
  return (
    <header className={styles.header}>
      <div className={styles.header_row}>
        <Hamburger onClick={onClick} />
        <Logo />
      </div>

      <SearchInput filterByLetter={filterByLetter} filterLetter={filterLetter} />

      <Navbar 
        isLoggedIn={isLoggedIn} 
        changeGrid={changeGrid} 
        gridType={gridType} />
    </header>
  );
};
