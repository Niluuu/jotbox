import classNames from 'classnames';
import styles from './Button.module.scss';

export interface ButtonProps {
  size?: 'small' | 'medium' | 'large'; // How large should the button be?
  type?: 'submit' | 'button' | 'reset'; // Button Type
  color?: 'primary' | 'secondary' | 'gray' | 'white'; // Pick from possible colors
  iconButton?: boolean; // Change the type of button to IconButton
  className?: string; // Optional class
  onClick?: () => void; // Optional click handler
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
