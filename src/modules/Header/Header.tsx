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
  /**
   * onclick for toggle sidebar
   */
  onClick: () => void;
}

/**
 * Main Header component for user interaction
 */

export const Header: FC<HeaderProps> = ({ isLoggedIn, onClick }) => {
  return (
    <header className={styles.header}>
      <div className={styles.header_row}>
        <Hamburger onClick={onClick} />
        <Logo />
      </div>

      <SearchInput />

      <Navbar isLoggedIn={isLoggedIn} />
    </header>
  );
};
