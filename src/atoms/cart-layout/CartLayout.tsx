import { FC } from 'react';
import classNames from 'classnames';
import styles from './CartLayout.module.scss';
import Cart from '../../component/cart/Cart';

interface CartProps {
  _version: number;
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  gaps: string[];
  color: string;
}

interface CartLayoutProps {
  gridType: boolean;
  carts: CartProps[];
  onRemoveCart?: (id: string, _version: number) => void;
  onChangeArchived?: (id: string, title: string, description: any) => void;
  onChangePin?: (id: string, pined: boolean, _version: number) => void;
  onHyperLinkEditMode?: () => void;
  onSetIsMain?: (bool: boolean) => void;
  onCartLabel?: (value: string) => void;
  cartLabel?: string;
  onSetLabel?: (id, oldGaps: string[]) => void;
  filteredGaps?: string[];
  onColorChange?: (id: any, color: string, _version: number) => void;
}

const CartLayout: FC<CartLayoutProps> = ({
  gridType,
  onChangeArchived,
  onChangePin,
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
        {notifications &&
          carts !== undefined &&
          notifications
            .filter((cart) => cart.pined)
            .map((cart) => (
              <Cart
                key={cart.id}
                id={cart.id}
                gaps={cart.gaps}
                title={cart.title}
                description={cart.description}
                pined={cart.pined}
                color={cart.color}
                /* eslint no-underscore-dangle: 0 */
                _version={cart._version}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onRemoveCart={onRemoveCart}
                onHyperLinkEditMode={onHyperLinkEditMode}
                onSetIsMain={onSetIsMain}
                onCartLabel={onCartLabel}
                cartLabel={cartLabel}
                onSetLabel={onSetLabel}
                filteredGaps={filteredGaps}
                gridType={gridType}
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
        {notifications &&
          carts !== undefined &&
          notifications
            .filter((cart) => !cart.pined)
            .map((cart) => (
              <Cart
                key={cart.id}
                id={cart.id}
                title={cart.title}
                gaps={cart.gaps}
                description={cart.description}
                pined={cart.pined}
                color={cart.color}
                /* eslint no-underscore-dangle: 0 */
                _version={cart._version}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onRemoveCart={onRemoveCart}
                onHyperLinkEditMode={onHyperLinkEditMode}
                onSetIsMain={onSetIsMain}
                onCartLabel={onCartLabel}
                cartLabel={cartLabel}
                onSetLabel={onSetLabel}
                filteredGaps={filteredGaps}
                gridType={gridType}
                onColorChange={onColorChange}
              />
            ))}
      </div>
    </div>
  );
};

export default CartLayout;
