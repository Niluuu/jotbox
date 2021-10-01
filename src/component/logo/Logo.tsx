import { FC } from 'react';
import classNames from 'classnames';
import styles from './Logo.module.scss';
import LogoSvg from '../../assets/images/jotbox.png';

export interface LogoProps {
  /**
   * Text only
   */
  hideIcon?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Logos only intent
   */
  dark?: boolean;
  /**
   * className
   */
  className?: string;
  /**
   * TitleName
   */

  title?: string;
}

/**
 * Main Logo component for user interaction
 */

const Logo: FC<LogoProps> = ({ dark, hideIcon, onClick, className, title = 'Jotbox' }) => {
  return (
    <a className={classNames(styles.logo, className)} onClick={onClick}>
      {!hideIcon && <img src={LogoSvg} />}
      <span className={styles.logo__title}>{title}</span>
    </a>
  );
};

export default Logo;
