import classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import styles from './Chip.module.scss';

export interface ChipProps {
  delateIcon?: boolean;
  onDelate: (e: any) => void;
}

/**
 * Main Chip component for user interaction
 */

export const Chip: React.FC<ChipProps> = ({ delateIcon, onDelate, children }) => {
  return (
    <div className={styles.chip}>
      <span>{children}</span>
      <Icon name="exit" size="xs" />
    </div>
  );
};
