import { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import { InputNavbar } from '../input/InputNavbar';
import MainEditor from '../../modules/Editor/MainEditor';
import { getIdNode } from '../../reducers/nodes';
import './Color.scss';

interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  gaps?: string[];
  _version?: number;
  onRemoveCart?: (id: string, _version: number) => void;
  onChangePin?: (id: string, pined: boolean, _version: number) => void;
  onChangeArchived?: (
    id: string,
    archived: boolean,
    _version: number,
    title: string,
    description: string,
  ) => void;
  onLabelEdit?: () => void;
  labelEdit?: boolean;
  onCartLabel?: (value: string) => void;
  cartLabel?: string;
  gridType?: boolean;
  popupCart?: boolean;
  color: string;
  onColorChange?: (id: string, color: string, _version: number) => void;
  archived: boolean;
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
    onCartLabel,
    cartLabel,
    gridType,
    popupCart,
    color,
    onColorChange,
    archived,
  } = props;
  const [isMain] = useState(false);
  const dispatch = useDispatch();

  const onOpenModal = useCallback(
    (nodeId) => {
      dispatch(getIdNode(nodeId));
    },
    [dispatch],
  );

  return (
    <div
      id={id}
      key={id}
      className={classNames(
        styles.cart,
        color,
        gridType && styles.column,
        popupCart && styles.popupCart,
      )}
    >
      <button
        type="button"
        className={styles.icon_btn}
        onClick={() => onChangePin(id, !pined, _version)}
      >
        {pined ? (
          <Icon name="pin-black" color="premium" size="xs" />
        ) : (
          <Icon name="pin" color="premium" size="xs" />
        )}
      </button>
      <div className={styles.cart_content} onClick={() => !popupCart && onOpenModal(id)}>
        <div className={styles.cart_title}>
          <p>{title}</p>
        </div>
        {description && <MainEditor color={color} initialState={description} />}
      </div>
      <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
      <div className={styles.main_chips}>
        {gaps && gaps.length > 2 ? (
          <div>
            <Chip onDelate={(e) => e}> {gaps[0]} </Chip>
            <Chip onDelate={(e) => e}> {gaps[1]} </Chip>
            <div className={styles.extraGap}> +{gaps.length - 2} </div>
          </div>
        ) : (
          gaps.map((gap) => <Chip onDelate={(e) => e}> {gap} </Chip>)
        )}
      </div>
      <div className={styles.input_navbar}>
        <InputNavbar
          withHistory
          isMainInput={isMain}
          cartLabel={cartLabel}
          currentColor={color}
          selectedGaps={gaps}
          onCartLabel={onCartLabel}
          onRemoveCart={() => onRemoveCart(id, _version)}
          onColorChange={(currentColor) => onColorChange(id, currentColor, _version)}
          onChangeArchived={() => onChangeArchived(id, !archived, _version, title, description)}
        />
      </div>
    </div>
  );
};

export default Cart;
