import { FC } from 'react';
import styles from './Avatar.module.scss';
import avatar from '../../assets/images/avatar.png';

export interface AvatarProps {
  hover?: boolean;
}

/**
 * Main Avatar component for user interaction
 */

export const Avatar: FC<AvatarProps> = ({ hover }) => {
  return (
    <div className={hover ? styles.avatar : styles.img_avatar}>
      <img src={avatar} alt="" />
    </div>
  );
};
