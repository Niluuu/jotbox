import { FC } from 'react';
import classNames from 'classnames';
import styles from '../../atoms/cart-layout/CartLayout.module.scss';
import Cart from '../../component/cart/Cart';

interface TrashCartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
}

interface TrashCartLayoutProps {
  gridType: boolean;
  carts: TrashCartProps[];
  onRemoveCart?: (id: any) => void;
  onChangePin?: (id: any) => void;
  onChangeArchived?: (id: any) => void;
  onHyperLinkEditMode?: () => void;
  onRemoveTrash?: (id: any) => void;
  onRestoreTrash?: (id: any) => void;
}

const TrashCartLayout: FC<TrashCartLayoutProps> = ({
  gridType,
  onChangeArchived,
  onChangePin,
  onRemoveCart,
  onRemoveTrash,
  onRestoreTrash,
  carts,
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
              description={cart.description}
              pined={cart.pined}
              onChangeArchived={onChangeArchived}
              onChangePin={onChangePin}
              onRemoveCart={onRemoveCart}
              onRemoveTrash={onRemoveTrash}
              onRestoreTrash={onRestoreTrash}
              isTrashPage={!!true}
            />
          ))}
      </div>
    </div>
  );
};

export default TrashCartLayout;
