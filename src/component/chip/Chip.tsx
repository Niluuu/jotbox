import { Icon } from '../Icon/Icon';
import styles from './Chip.module.scss';

export interface ChipProps {
  delateIcon?: boolean;
  onDelate?: () => void;
}

/**
 * Main Chip component for user interaction
 */

export const Chip: React.FC<ChipProps> = ({ onDelate, children }) => {
  return (
    <div className={styles.chip}>
      <span>{children}</span>
      <Icon onClick={() => onDelate()} name="exit" size="xs" />
    </div>
  );
};
