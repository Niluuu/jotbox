import classNames from 'classnames';
import { FC } from 'react';
import styles from './Hamburger.module.scss';

interface HamburgerProps {
  className?: string;
  /**
   * onclick for toggle sidebar
   */
  onClick: () => void;
}

const Hamburger: FC<HamburgerProps> = ({ className, onClick }) => (
  <button type="button" className={classNames(className, styles.header_button)} data-hamburger="" onClick={onClick}>
    <svg focusable="false" viewBox="0 0 24 24">
      <path fill="#5f6368" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
    <input className={styles.input} type="checkbox" />
  </button>
);

export default Hamburger;
