import { FC } from 'react';
import classNames from 'classnames';
import styles from './CartLayout.module.scss';
import Cart from '../../component/cart/Cart';

interface CartProps {
  id: string;
  title: string;
  description: string;
  pinned: boolean;
}

interface CartLayoutProps {
  gridType: boolean;
  isNotification?: boolean;
  isTrash?: boolean;
  carts: CartProps[];
  onRemoveCart?: (id: any) => void;
  onChangePin?: (id: any) => void;
  onHyperLinkEditMode?: () => void;
}

const CartLayout: FC<CartLayoutProps> = ({
  onHyperLinkEditMode,
  isNotification,
  isTrash,
  gridType,
  onChangePin,
  onRemoveCart,
  carts,
}) => {
  return (
    <div className={classNames(styles.layout, gridType && styles.grid4)}>
      {isNotification && (
        <>
          {carts.some((cart) => cart.pinned) && (
            <h1 className={styles.layout_title}> Закрепленные </h1>
          )}
          <div className={classNames(styles.carts_layout, gridType && styles.grid4)}>
            {carts &&
              carts
                .filter((cart) => cart.pinned)
                .map((cart) => (
                  <Cart
                    key={cart.id}
                    id={cart.id}
                    title={cart.title}
                    gridType={gridType}
                    description={cart.description}
                    pinned={cart.pinned}
                    onChangePin={onChangePin}
                    onRemoveCart={onRemoveCart}
                  />
                ))}
          </div>
        </>
      )}
      {isNotification && carts.some((cart) => !cart.pinned) && (
        <h1 className={styles.layout_title}> Заметки </h1>
      )}
      <div className={classNames(styles.carts_layout, gridType && styles.grid4)}>
        {carts &&
          carts
            .filter((cart) => !cart.pinned)
            .map((cart) => (
              <Cart
                key={cart.id}
                id={cart.id}
                title={cart.title}
                gridType={gridType}
                description={cart.description}
                pinned={cart.pinned}
                isTrash={isTrash}
                onChangePin={onChangePin}
                onRemoveCart={onRemoveCart}
              />
            ))}
      </div>
    </div>
  );
};

export default CartLayout;
