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

interface TrashCartLayoutProps {
  gridType: boolean;
  carts: CartProps[];
  onRemoveCart?: (id: any) => void;
  onChangePin?: (id: any) => void;
  onChangeArchived?: (id: any) => void;
  onHyperLinkEditMode?: () => void;
  onRemoveTrash?: (id: any) => void;
  onRestoreTrash?: (id: any) => void;
  onColorChange?: (id: any, color: string) => void;
}

const TrashCartLayout: FC<TrashCartLayoutProps> = ({
  gridType,
  onChangeArchived,
  onChangePin,
  onRemoveCart,
  onRemoveTrash,
  onRestoreTrash,
  carts,
  onColorChange
}) => {
  return (
    <div className={classNames(styles.layout, gridType && styles.column)}>
      <div className={classNames(styles.carts_layout, gridType && styles.column)}>
        {carts &&
          carts.map((cart) => (
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

export default TrashCartLayout;
