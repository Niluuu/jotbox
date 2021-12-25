import { FC, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import { InputNavbar } from '../input/InputNavbar';
import { TrashInputNavbar } from '../input/TrashInputNavbar';
import MainEditor from '../../modules/Editor/MainEditor';
import { getIdNode } from '../../reducers/nodes';

interface CartProps {
  id: any;
  title: string;
  description: any;
  pined: boolean;
  isTrashPage?: boolean;
  gaps?: any[];
  onHyperLinkEditMode?: () => void;
  onRemoveCart?: (id: any) => void;
  onChangePin?: (id: any, title: string, description: any) => void;
  onResetNodes?: (id: any, title: string, description: any) => void;
  onChangeArchived?: (id: any, title: string, description: any) => void;
  onRestoreTrash?: (id: any) => void;
  onRemoveTrash?: (id: any) => void;
  onSetIsMain?: (bool: boolean) => void;
  onLabelEdit?: () => void;
  labelEdit?: boolean;
  onCartLabel?: (value: string) => void;
  cartLabel?: string;
  onSetLabel?: (id, oldGaps: string[]) => void;
  filteredGaps?: any[];
  gridType?: boolean;
  popupCart?: boolean
}

const Cart: FC<CartProps> = ({
  id,
  title,
  pined,
  description,
  gaps,
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
  popupCart
}) => {
  const dispatch = useDispatch();
  
  const onOpenModal = useCallback(
    (nodeId) => {
       dispatch(getIdNode(nodeId));
    },
    [],
  )
  
  return (
      <div 
      id={id}
      key={id}
      className={classNames(styles.cart, gridType && styles.column, popupCart && styles.popupCart)} 
      onClick={() => !popupCart && onOpenModal(id)}
      >
      <div className={styles.cart_content}>
          <div className={styles.cart_title}>
            <p> {title} </p>
            {!isTrashPage && (
              <button
                type="button"
                onClick={() => onChangePin(id, title, description)}
                className={styles.icon_btn}
              >
                {!pined ? (
                  <Icon name="pin" color="premium" size="xs" />
                ) : (
                  <Icon name="pin-black" color="premium" size="xs" />
                )}
              </button>
            )}
          </div>
          {description && <MainEditor initialState={description} />}
        </div>
        <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
        <div className={styles.main_chips}>
          {gaps && gaps.map((gap) => <Chip onDelate={() => console.log('delate')}> {gap} </Chip>)}
        </div>
        {/* <div className={styles.input_navbar}>
          {isTrashPage ? (
            <TrashInputNavbar
              onRestoreTrash={() => onRestoreTrash(id)}
              onRemoveTrash={() => onRemoveTrash(id)}
              withHistory={!!true}
              ontoggle={() => setIsOpen(false)}
            />
          ) : (
            <InputNavbar
              onRemoveCart={() => onRemoveCart(id)}
              withHistory={!!true}
              isMainInput={!true}
              onSetIsMain={onSetIsMain}
              onHyperLinkEditMode={() => {
                setIsOpen(true);
                onHyperLinkEditMode();
              }}
              onChangeArchived={() => onChangeArchived(id, title, description)}
              ontoggle={() => setIsOpen(false)}
              onCartLabel={onCartLabel}
              cartLabel={cartLabel}
              onSetLabel={(oldGaps: string[]) => onSetLabel(id, oldGaps)}
              filteredGaps={filteredGaps}
            />
          )}
        </div> */}
      </div>
  );
};

export default Cart;
