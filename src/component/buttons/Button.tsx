import classNames from 'classnames';
import styles from './Button.module.scss';

export interface ButtonProps {
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Button Type
   */

  type?: 'submit' | 'button' | 'reset';

  /**
   * Pick from possible colors
   */
  color?: 'primary' | 'secondary' | 'gray' | 'white';
  /**
   * Change the type of button to IconButton
   */
  iconButton?: boolean;
  /**
   * Optional class
   */
  className?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Main Button component for user interaction
 */

export const Button: React.FC<ButtonProps> = ({
  size = 'medium',
  type = 'button',
  color,
  children,
  iconButton,
  className,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        styles.Button,
        styles[`size-${size}`],
        styles[color ? `color-${color}` : undefined],
        {
          [styles.iconButton]: iconButton,
        },
        className,
      )}
      // eslint-disable-next-line react/button-has-type
      type={type}
    >
      {children}
    </button>
  );
};
