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
  onChangeArchived?: (
    id: string,
    archived: boolean,
    _version: number,
    title: string,
    description: string,
  ) => void;
  onChangePin?: (id: string, pined: boolean, _version: number) => void;
  onCartLabel?: (value: string) => void;
  onColorChange?: (id: string, color: string, _version: number) => void;
}

const CartLayout: FC<CartLayoutProps> = ({
  gridType,
  onChangeArchived,
  onChangePin,
  onRemoveCart,
  carts,
  onCartLabel,
  onColorChange,
}) => {
  return (
    <div className={classNames(styles.layout, gridType && styles.column)}>
      {carts.some((cart) => cart.pined) && (
        <div className={classNames(styles.layout_div, gridType && styles.column)}>
          <h1 className={styles.layout_title}> Закрепленные </h1>
        </div>
      )}
      {carts && (
        <div className={classNames(styles.carts_layout, gridType && styles.column)}>
          {carts
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
                archived={cart.archived}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onRemoveCart={onRemoveCart}
                onCartLabel={onCartLabel}
                gridType={gridType}
                onColorChange={onColorChange}
              />
            ))}
        </div>
      )}
      {carts.some((cart) => !cart.pined) && (
        <div className={classNames(styles.layout_div, gridType && styles.column)}>
          <h1 className={styles.layout_title}> Заметки </h1>
        </div>
      )}
      {carts && (
        <div className={classNames(styles.carts_layout, gridType && styles.column)}>
          {carts
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
                archived={cart.archived}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onRemoveCart={onRemoveCart}
                onCartLabel={onCartLabel}
                gridType={gridType}
                onColorChange={onColorChange}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CartLayout;
