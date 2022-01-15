import classNames from 'classnames';
import { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getIdNode, closeUpdateModalIsOpen } from '../../reducers/getNodeId';
import styles from '../../component/tooltip/Tooltip.module.scss';

export interface NodeLinkProps {
  /**
   * onclick for toggle sidebar
   */
  id: string;
}

/**
 * Main NodeLink component for user interaction
 */

export const NodeLink: FC<NodeLinkProps> = ({ id, children }) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(
    (nodeId) => {
      dispatch(getIdNode(''));
      dispatch(closeUpdateModalIsOpen());

      setTimeout(() => {
        dispatch(getIdNode(nodeId));
      }, 1000);
    },
    [dispatch],
  );

  return (
    <div className={classNames(styles.linkfy, styles.link)} onClick={() => handleClick(id)}>
      <div>{children}</div>
    </div>
  );
};
