import { FC } from 'react';
import classNames from 'classnames';
import styles from '../../atoms/cart-layout/CartLayout.module.scss';
import Cart from '../../component/cart/Cart';

interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  gaps: string[];
  _version: number;
  color: string;
}

interface ArchiveCartLayout {
  gridType: boolean;
  isNotification?: boolean;
  carts: CartProps[];
  onRemoveCart?: (id: string) => void;
  onChangeArchived?: (id: string, title: string, description: string) => void;
  onChangePin?: (id: string, pined: boolean) => void;
  onHyperLinkEditMode?: () => void;
  onColorChange?: (id: string, color: string) => void;
}

const ArchiveCartLayout:  FC<ArchiveCartLayout> = ({
  onChangeArchived,
  gridType,
  onChangePin,
  onRemoveCart,
  carts,
  onColorChange,
}) => {
  return (
    <div className={classNames(styles.layout, gridType && styles.column)}>
      <div className={classNames(styles.carts_layout, gridType && styles.column)}>
        {carts &&
          carts
            .filter((cart) => cart.archived)
            .filter((cart) => !cart.pined)
            .map((cart) => (
              <Cart
                key={cart.id}
                id={cart.id}
                title={cart.title}
                gridType={gridType}
                gaps={cart.gaps}
                /* eslint no-underscore-dangle: 0 */
                _version={cart._version}
                description={cart.description}
                pined={cart.pined}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onRemoveCart={onRemoveCart}
                color={cart.color}
                onColorChange={onColorChange}
              />
            ))}
      </div>
    </div>
  );
};

export default ArchiveCartLayout;
