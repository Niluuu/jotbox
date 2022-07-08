/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { FC } from 'react';
import classNames from 'classnames';
import styles from './Logo.module.scss';
import LogoSvg from '../../assets/images/jotbox.png';

export interface LogoProps {
  hideIcon?: boolean; // Text only
  onClick?: () => void; // Optional click handler
  className?: string; //  className
  title?: string; // TitleName
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
