/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
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

const Logo: FC<LogoProps> = ({ hideIcon, onClick, className }) => {
  return (
    <a className={classNames(styles.logo, className)} onClick={onClick}>
      {!hideIcon && <img src={LogoSvg} />}
    </a>
  );
};

export default Logo;
