import { FC } from 'react';
import classNames from 'classnames';
import styles from './CartLayout.module.scss';
import Cart from '../cart/Cart';

interface CartProps {
  id: any;
  title: string;
  description: any;
  pined: boolean;
  archived: boolean;
  gaps: any[];
  trashed: boolean;
  color: string;
}

interface CartLayoutProps {
  gridType: boolean;
  carts: CartProps[];
  onRemoveCart?: (id: any) => void;
  onReSetCart?: (id: any, title: string, description: any) => void;
  onChangeArchived?: (id: any, title: string, description: any) => void;
  onChangePin?: (id: any, title: string, description: any) => void;
  onHyperLinkEditMode?: () => void;
  onSetIsMain?: (bool: boolean) => void;
  onCartLabel?: (value: string) => void;
  cartLabel?: string;
  onSetLabel?: (id, oldGaps: string[]) => void;
  filteredGaps?: any[];
  onColorChange?: (id: any, color: string) => void;
}

const CartLayout: FC<CartLayoutProps> = ({
  gridType,
  onChangeArchived,
  onChangePin,
  onReSetCart,
  onRemoveCart,
  onHyperLinkEditMode,
  carts,
  onSetIsMain,
  onCartLabel,
  cartLabel,
  onSetLabel,
  filteredGaps,
  onColorChange
}) => {
  const notifications = carts !== undefined && carts.filter((cart) => !cart.archived);
  return (
    <div className={classNames(styles.layout, gridType && styles.column)}>
      {carts !== undefined && notifications.some((cart) => cart.pined) && (
        <div className={classNames(styles.layout_div, gridType && styles.column)}>
          <h1 className={styles.layout_title}> Закрепленные </h1>
        </div>
      )}
      <div className={classNames(styles.carts_layout, gridType && styles.column)}>
        { notifications && carts !== undefined && 
          notifications
            .filter((cart) => cart.pined)
            .map((cart) => (
              <Cart
                key={cart.id}
                id={cart.id}
                gaps={cart.gaps}
                title={cart.title}
                gridType={gridType}
                description={cart.description}
                pined={cart.pined}
                color={cart.color}
                trashed={cart.trashed}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onReSetCart={onReSetCart}
                onRemoveCart={onRemoveCart}
                onHyperLinkEditMode={onHyperLinkEditMode}
                onSetIsMain={onSetIsMain}
                onCartLabel={onCartLabel}
                cartLabel={cartLabel}
                onSetLabel={onSetLabel}
                filteredGaps={filteredGaps}
                onColorChange={onColorChange}
              />
            ))}
      </div>
      {carts !== undefined && notifications.some((cart) => !cart.pined) && (
        <div className={classNames(styles.layout_div, gridType && styles.column)}>
          <h1 className={styles.layout_title}> Заметки </h1>
        </div>
      )}
      <div className={classNames(styles.carts_layout, gridType && styles.column)}>
        { notifications && carts !== undefined && 
          notifications
            .filter((cart) => !cart.pined)
            .map((cart) => (
              <Cart
                key={cart.id}
                id={cart.id}
                title={cart.title}
                gaps={cart.gaps}
                gridType={gridType}
                description={cart.description}
                pined={cart.pined}
                color={cart.color}
                trashed={cart.trashed}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onReSetCart={onReSetCart}
                onRemoveCart={onRemoveCart}
                onHyperLinkEditMode={onHyperLinkEditMode}
                onSetIsMain={onSetIsMain}
                onCartLabel={onCartLabel}
                onSetLabel={onSetLabel}
                filteredGaps={filteredGaps}
                onColorChange={onColorChange}
              />
            ))}
      </div>
    </div>
  );
};

export default CartLayout;
