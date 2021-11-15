import { FC } from 'react';
import classNames from 'classnames';
import styles from './CartLayout.module.scss';
import Cart from '../cart/Cart';

interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  gaps: any[]
}

interface CartLayoutProps {
  gridType: boolean;
  carts: CartProps[];
  cartTitleRef?: any;
  cartTextRef?: any;
  cartHyper?: any;
  onRemoveCart?: (id: any) => void;
  onReSetCart?: (id: any, title: string, description: any) => void;
  onChangeArchived?: (id: any, title: string, description: any) => void;
  onChangePin?: (id: any, title: string, description: any) => void;
  onHyperLinkEditMode?: () => void;
  onSetIsMain?: (bool: boolean) => void;
}

const CartLayout: FC<CartLayoutProps> = ({
  cartHyper,
  gridType,
  onChangeArchived,
  onChangePin,
  onReSetCart,
  onRemoveCart,
  onHyperLinkEditMode,
  cartTitleRef,
  cartTextRef,
  carts,
  onSetIsMain
}) => {
  const notifications = carts.filter((cart) => !cart.archived);

  return (
    <div className={classNames(styles.layout, gridType && styles.column)}>
      { notifications.some((cart) => cart.pined) && (
        <div className={classNames(styles.layout_div, gridType && styles.column)}>
          <h1 className={styles.layout_title}> Закрепленные </h1>
        </div>
      )}
      <div className={classNames(styles.carts_layout, gridType && styles.column)}>
        { notifications &&
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
                cartHyper={cartHyper}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onReSetCart={onReSetCart}
                onRemoveCart={onRemoveCart}
                onHyperLinkEditMode={onHyperLinkEditMode}
                onSetIsMain={onSetIsMain}
              />
            ))}
      </div>
      { notifications.some((cart) => !cart.pined) && (
        <div className={classNames(styles.layout_div, gridType && styles.column)}>
          <h1 className={styles.layout_title}> Заметки </h1>
        </div>
      )}
      <div className={classNames(styles.carts_layout, gridType && styles.column)}>
        { notifications &&
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
                cartHyper={cartHyper}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onReSetCart={onReSetCart}
                onRemoveCart={onRemoveCart}
                onHyperLinkEditMode={onHyperLinkEditMode}
                onSetIsMain={onSetIsMain}
              />
            ))}
      </div>
    </div>
  );
};

export default CartLayout;
