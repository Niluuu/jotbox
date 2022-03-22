import { FC } from 'react';
import classNames from 'classnames';
import styles from './Icon.module.scss';
import sprite from '../../assets/images/sprites.svg';

/**
 * @see https://github.com/elrumsvg-spreact 
ordelaluz/svg-spreact-cli
 *
 * @use "generate-icons" script to generate /assets/images/sprites.svg from /assets/images/svg-icons
 * 
 */

export type iconSizes = 'xs' | 'small' | 'medium' | 'large' | 'min';
export type iconNames =
  | 'account'
  | 'burger'
  | 'box'
  | 'remove'
  | 'search'
  | 'setting'
  | 'grid'
  | 'grid2'
  | 'grid3'
  | 'grid4'
  | 'loading'
  | 'cloud'
  | 'user'
  | 'picture'
  | 'add-accaunt'
  | 'notes'
  | 'gaps'
  | 'archive'
  | 'notification'
  | 'edit'
  | 'basket'
  | 'labels'
  | 'filled-label'
  | 'exit'
  | 'error'
  | 'delete'
  | 'delete-forever'
  | 'done'
  | 'add'
  | 'edit-bordered'
  | 'img'
  | 'back'
  | 'color-picer'
  | 'restore'
  | 'dowland'
  | 'notification-add'
  | 'other'
  | 'user-add'
  | 'success'
  | 'link'
  | 'pin-black'
  | 'addlink'
  | string;

export interface IconProps {
  /**
   * How large should the Icon be?
   */
  size?: iconSizes;

  /**
   * Pick Icon Name
   */
  name: iconNames;

  /**
   * Pick from possible colors
   */
  color?: 'premium' | 'dark';
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Pass addintional classnames
   */
  className?: string;
}

/**
 * Main Icon component
 */

export const Icon: FC<IconProps> = ({ size = 'small', name, color = '', onClick, className }) => {
  return (
    <svg
      className={classNames(styles.icon, styles[size], className)}
      onClick={onClick}
      fill={color === 'premium' ? '#5f6368' : '#333'}
    >
      <use href={`${sprite}#${name}`} aria-hidden />
    </svg>
  );
};
