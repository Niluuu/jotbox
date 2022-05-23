/* eslint-disable react/require-default-props */
// import { Example, handleBooleanChange, IExampleProps } from '@blueprintjs/docs-theme';
import { Popover2 } from '@blueprintjs/popover2';
import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import styles from './Popover.module.scss';

export interface PopoverProps {
  /**
   * Passed to controlled Popover
   */
  isOpen?: boolean;
  /**
   * Content of the Popover
   */
  content?: ReactNode;
  /**
   * placement of the content
   */
  placement?: 'bottom-end' | 'bottom-start';
  /**
   * Remove shadow
   */
  noShadow?: boolean;
}

/**
 * @see https://blueprintjs.com/docs/#popover2-package
 * @example Blueprint https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples/popover2-examples/popover2Example.tsx
 */

const Popover: FC<PopoverProps> = ({
  content,
  children,
  placement = 'bottom-start',
  noShadow,
  isOpen,
}) => {
  return (
    <>
      <Popover2
        popoverClassName={classNames(styles.popover, styles[placement], {
          [styles.noShadow]: noShadow,
        })}
        isOpen={isOpen}
        enforceFocus={false}
        content={<div>{content}</div>}
        placement={placement}
        usePortal
        modifiers={{ arrow: { enabled: false } }}
      >
        {children}
      </Popover2>
    </>
  );
};

export default Popover;
