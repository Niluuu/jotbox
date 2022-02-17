import { FC, useCallback, useState, useRef } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import { InputNavbar } from '../input/InputNavbar';
import MainEditor from '../../modules/Editor/MainEditor';
import { getIdNode } from '../../reducers/getNodeId';
import './Color.scss';

interface CartProps {
  /**
   * Node Id
   */
  id: string;
  /**
   * Node title
   */
  title: string;
  /**
   * Node description
   */
  description: string;
  /**
   * Node is pined?
   */
  pined: boolean;
  /**
   * Node labels
   */
  gaps?: string[];
  /**
   * Node version of node
   */
  _version?: number;
  /**
   * Node archived or not?
   */
  archived: boolean;
  /**
   * Node color
   */
  color: string;
  /**
   * Delete node
   */
  onRemoveCart?: (id: string, _version: number) => void;
  /**
   * Toggle node pined
   */
  onChangePin?: (id: string, pined: boolean, _version: number) => void;
  /**
   * Change node archived
   */
  onChangeArchived?: (
    id: string,
    archived: boolean,
    _version: number,
    title: string,
    description: string,
  ) => void;
  /**
   * Node color change func
   */
  onColorChange?: (id: string, color: string, _version: number) => void;
  /**
   * Layout type for cart size
   */
  gridType: boolean;
  /**
   * ?
   */
  popupCart?: boolean;
  /**
   * Toggle gaps of Node function
   */
  toggleGapsCart?: (id: string, _version: number, gap: any) => void;
}

const Cart: FC<CartProps> = (props) => {
  const {
    id,
    title,
    pined,
    description,
    gaps,
    _version,
    onChangePin,
    onChangeArchived,
    onRemoveCart,
    gridType,
    popupCart,
    color,
    onColorChange,
    toggleGapsCart,
    archived,
  } = props;
  const [isMain] = useState(false);
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const onOpenModal = useCallback(
    (nodeId) => {
      dispatch(getIdNode(nodeId));
    },
    [dispatch],
  );

  const isLarge = !title;

  return (
    <div
      id={id}
      className={classNames(
        styles.cart,
        color,
        gridType && styles.column,
        popupCart && styles.popupCart,
      )}
    >
      <button
        type="button"
        className={classNames(styles.icon_btn, styles.pin)}
        onClick={() => onChangePin(id, !pined, _version)}
      >
        {pined ? (
          <Icon name="pin-black" color="premium" size="xs" />
        ) : (
          <Icon name="pin" color="premium" size="xs" />
        )}
      </button>
      <div className={styles.cart_content} onClick={() => !popupCart && onOpenModal(id)}>
        <div className={classNames(styles.cart_title, isLarge && styles.empty)}>
          <p>{title}</p>
        </div>
        {description && (
          <MainEditor isLarge={isLarge} color={color} initialState={description} editorRef={editorRef} readOnly />
        )}
      </div>
      <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
      <div className={styles.main_chips}>
        {gaps &&
          (gaps.length > 2 ? (
            <>
              <Chip onDelate={() => toggleGapsCart(id, _version, gaps[0])}> {gaps[0]} </Chip>
              <Chip onDelate={() => toggleGapsCart(id, _version, gaps[1])}> {gaps[1]} </Chip>
              <div className={styles.extraGap}> +{gaps.length - 2} </div>
            </>
          ) : (
            gaps.map((gap) => (
              <Chip onDelate={() => toggleGapsCart(id, _version, gap)}> {gap} </Chip>
            ))
          ))}
      </div>
      <div className={styles.input_navbar}>
        <InputNavbar
          noAddLink
          isMainInput={isMain}
          currentColor={color}
          selectedGaps={gaps}
          onRemoveCart={() => onRemoveCart(id, _version)}
          onColorChange={(currentColor) => onColorChange(id, currentColor, _version)}
          toggleGapsCart={(gap) => toggleGapsCart(id, _version, gap)}
          onChangeArchived={() => onChangeArchived(id, !archived, _version, title, description)}
        />
      </div>
    </div>
  );
};

export default Cart;
