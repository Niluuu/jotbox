import { FC } from 'react';
import classNames from 'classnames';
import styles from '../../component/cart-layout/CartLayout.module.scss';
import Cart from '../../component/cart/Cart';

interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
}

interface ArchiveCartLayout {
  gridType: boolean;
  isNotification?: boolean;
  carts: CartProps[];
  onRemoveCart?: (id: string) => void;
  onChangePin?: (id: string) => void;
  onChangeArchived?: (id: string) => void;
  onHyperLinkEditMode?: () => void;
}

const ArchiveCartLayout: FC<ArchiveCartLayout> = ({
  onChangeArchived,
  gridType,
  onChangePin,
  onRemoveCart,
  carts,
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

export default ArchiveCartLayout;
