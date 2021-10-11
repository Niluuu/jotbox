import { FC, useState } from 'react';
import classNames from 'classnames';
import styles from './CartLayout.module.scss';
import Cart from '../../component/cart/Cart';

interface CartLayoutProps {
  isLogin?: boolean;
  gridType: boolean;
  cart: any;
}

// carts.concat(...carts, { id: "999", title: "great title", text: "fantastic text", link: "good link", img: null, chips: ["gap"]})
const CartLayout: FC<CartLayoutProps> = ({ isLogin, gridType, cart }) => {
  return (
    <div className={classNames(styles.layout, gridType? styles.grid4 : null)}>
      <h1 className={styles.layout_title}>Архив</h1>
      <div className={classNames(styles.carts_layout, gridType? styles.grid4 : null)}>
        {cart &&
          cart.map(({ id, title, text, link, img, chips }) => (
            <Cart key={id} id={id} title={title} text={text} 
              link={link} img={img} chips={chips} gridType={gridType} />
          ))}
      </div>
    </div>
  );
};

export default CartLayout;
