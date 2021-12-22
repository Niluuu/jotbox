import { FC } from 'react';
import classNames from 'classnames';
import styles from './Tooltip.module.scss';

export interface TooltipProps {
  path?: string;
  visible?: boolean;
}

/**
 * Main Tooltip component for user interaction
 */

export const Tooltip: FC<TooltipProps> = ({ path, visible }) => {
  console.log('path', path);
  return (
    <div className={classNames(styles.tooltip, visible && styles.visible)}>
      <span onClick={() => window.open(path)}>
        <span>open</span>
      </span>
    </div>
  );
};
