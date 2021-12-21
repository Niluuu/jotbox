import { FC } from 'react';
import classNames from 'classnames';
import styles from '../../component/cart-layout/CartLayout.module.scss';
import Cart from '../../component/cart/Cart';

interface CartProps {
  id: string;
  title: string;
  description: any;
  pined: boolean;
  archived: boolean;
  gaps: any[];
  trashed: boolean;
  color: string;
}

interface ArchiveCartLayout {
  gridType: boolean;
  isNotification?: boolean;
  carts: CartProps[];
  onRemoveCart?: (id: string) => void;
  onChangeArchived?: (id: any, title: string, description: any) => void;
  onChangePin?: (id: any, title: string, description: any) => void;
  onHyperLinkEditMode?: () => void;
  onColorChange?: (id: any, color: string) => void;
}

const ArchiveCartLayout: FC<ArchiveCartLayout> = ({
  onChangeArchived,
  gridType,
  onChangePin,
  onRemoveCart,
  carts,
  onColorChange
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
                description={cart.description}
                pined={cart.pined}
                onChangeArchived={onChangeArchived}
                onChangePin={onChangePin}
                onRemoveCart={onRemoveCart}
                color={cart.color}
                trashed={cart.trashed}
                onColorChange={onColorChange}
              />
            ))}
      </div>
    </div>
  );
};

export default ArchiveCartLayout;
