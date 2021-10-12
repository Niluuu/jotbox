import { FC } from 'react';
import classNames from 'classnames';
import styles from './CartLayout.module.scss';
import Cart from '../../component/cart/Cart';

interface CartProps {
  id: string;
  name: string;
  description: string;
}

interface CartLayoutProps {
  gridType: boolean;
  carts: CartProps[];
}

const CartLayout: FC<CartLayoutProps> = ({ gridType, carts }) => {
  return (
    <div className={classNames(styles.layout, gridType && styles.grid4)}>
      <h1 className={styles.layout_title}>Архив</h1>
      <div className={classNames(styles.carts_layout, gridType && styles.grid4)}>
        {carts && carts.map((cart) => <Cart key={cart.id} cart={cart} gridType={gridType} />)}
      </div>
    </div>
  );
};

export default CartLayout;
