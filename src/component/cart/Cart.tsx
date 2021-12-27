import { FC, useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import { InputNavbar } from '../input/InputNavbar';
import { TrashInputNavbar } from '../input/TrashInputNavbar';
import MainEditor from '../../modules/Editor/MainEditor';
import { getIdNode } from '../../reducers/nodes';

interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  isTrashPage?: boolean;
  gaps?: string[];
  _version?: number;
  onHyperLinkEditMode?: () => void;
  onRemoveCart?: (id: string, _version: number) => void;
  onChangePin?: (id: string, pined: boolean, _version: number) => void;
  onResetNodes?: (id: string, title: string, description: string) => void;
  onChangeArchived?: (id: string, title: string, description: string) => void;
  onRestoreTrash?: (id: string) => void;
  onRemoveTrash?: (id: string) => void;
  onSetIsMain?: (bool: boolean) => void;
  onLabelEdit?: () => void;
  labelEdit?: boolean;
  onCartLabel?: (value: string) => void;
  cartLabel?: string;
  onSetLabel?: (id, oldGaps: string[]) => void;
  filteredGaps?: string[];
  gridType?: boolean;
  popupCart?: boolean;
}

const Cart: FC<CartProps> = ({
  id,
  title,
  pined,
  description,
  gaps,
  _version,
  isTrashPage,
  onChangePin,
  onChangeArchived,
  onRestoreTrash,
  onRemoveTrash,
  onSetIsMain,
  onRemoveCart,
  onResetNodes,
  onHyperLinkEditMode,
  onCartLabel,
  cartLabel,
  onSetLabel,
  filteredGaps,
  gridType,
  popupCart,
}) => {
  const dispatch = useDispatch();

  const onOpenModal = useCallback((nodeId) => {
    dispatch(getIdNode(nodeId));
  }, []);

  return (
    <div
      id={id}
      key={id}
      className={classNames(styles.cart, gridType && styles.column, popupCart && styles.popupCart)}
    >
      {!isTrashPage && (
        <button
          type="button"
          onClick={() => onChangePin(id, !pined, _version)}
          className={styles.icon_btn}
        >
          {!pined ? (
            <Icon name="pin" color="premium" size="xs" />
          ) : (
            <Icon name="pin-black" color="premium" size="xs" />
          )}
        </button>
      )}
      <div className={styles.cart_content} onClick={() => !popupCart && onOpenModal(id)}>
        <div className={styles.cart_title}>
          <p> {title} </p>
        </div>
        {description && <MainEditor initialState={description} />}
      </div>
      <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
      <div className={styles.main_chips}>
        {gaps && gaps.map((gap) => <Chip onDelate={(e) => e}> {gap} </Chip>)}
      </div>
      <div className={styles.input_navbar}>
        {isTrashPage ? (
          <TrashInputNavbar
            onRestoreTrash={() => onRestoreTrash(id)}
            onRemoveTrash={() => onRemoveTrash(id)}
          />
        ) : (
          <InputNavbar
            onRemoveCart={() => onRemoveCart(id, _version)}
            withHistory={!!true}
            isMainInput={!true}
            onChangeArchived={() => onChangeArchived(id, title, description)}
            onCartLabel={onCartLabel}
            cartLabel={cartLabel}
            onSetLabel={(oldGaps: string[]) => onSetLabel(id, oldGaps)}
            filteredGaps={filteredGaps}
          />
        )}
      </div>
    </div>
  );
};

export default Cart;
