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
}

interface CartLayoutProps {
  gridType: boolean;
  carts: CartProps[];
  onRemoveCart?: (id: any) => void;
  onChangePin?: (id: any) => void;
  onChangeArchived?: (id: any) => void;
  onHyperLinkEditMode?: () => void;
}

const CartLayout: FC<CartLayoutProps> = ({
  gridType,
  onChangeArchived,
  onChangePin,
  onRemoveCart,
  carts,
}) => {
  const notifications = carts.filter((cart) => !cart.archived);

  return (
    <div className={classNames(styles.layout, gridType && styles.grid4)}>
      {notifications.some((cart) => cart.pined) && (
        <div className={classNames(styles.layout_div, gridType && styles.grid4)}>
          <h1 className={styles.layout_title}> Закрепленные </h1>
        </div>
      )}
      <div className={classNames(styles.carts_layout, gridType && styles.grid4)}>
        {notifications &&
          notifications
            .filter((cart) => cart.pined)
            .map((cart) => (
              <Cart
                key={cart.id}
                id={cart.id}
                title={cart.title}
                gridType={gridType}
                description={cart.description}
                pined={cart.pined}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onRemoveCart={onRemoveCart}
              />
            ))}
      </div>
      {notifications.some((cart) => !cart.pined) && (
        <div className={classNames(styles.layout_div, gridType && styles.grid4)}>
          <h1 className={styles.layout_title}> Заметки </h1>
        </div>
      )}
      <div className={classNames(styles.carts_layout, gridType && styles.grid4)}>
        {notifications &&
          notifications
            .filter((cart) => !cart.pined)
            .map((cart) => (
              <Cart
                key={cart.id}
                id={cart.id}
                title={cart.title}
                gridType={gridType}
                description={cart.description}
                pined={cart.pined}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onRemoveCart={onRemoveCart}
              />
            ))}
      </div>
    </div>
  );
};

export default CartLayout;
