import classNames from 'classnames';
import { FC, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { getIdNode, closeUpdateModalIsOpen } from '../../reducers/getNodeId';
import styles from '../../component/tooltip/Tooltip.module.scss';
import MentionContext from '../hooks/useCreatContext';

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
  const toggleModal = useContext(MentionContext);

  const handleClick = useCallback(
    (nodeId) => {
      toggleModal();

      setTimeout(() => {
        dispatch(closeUpdateModalIsOpen());
        dispatch(getIdNode(''));
      }, 50);

      setTimeout(() => {
        dispatch(getIdNode(nodeId));
      }, 1000);
    },
    [dispatch, toggleModal],
  );

  return (
    <div className={classNames(styles.linkfy, styles.link)}>
      <div className={styles.tooltip}>
        <span contentEditable="false" onClick={() => handleClick(id)}>
          Open
        </span>
        <br />
      </div>
      <div>{children}</div>
    </div>
  );
};
