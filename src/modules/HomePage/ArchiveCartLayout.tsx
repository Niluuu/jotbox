import { FC } from 'react';
import classNames from 'classnames';
import styles from './CartLayout.module.scss';
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
  isTrashPage?: boolean;
  carts: CartProps[];
  onRemoveCart?: (id: any) => void;
  onChangePin?: (id: any) => void;
  onHyperLinkEditMode?: () => void;
}

const ArchiveCartLayout: FC<ArchiveCartLayout> = ({ isNotification, isTrashPage, gridType, onChangePin, onRemoveCart, carts }) => {
  return (
    <div className={classNames(styles.layout, gridType && styles.grid4)}>
        <div className={classNames(styles.carts_layout, gridType && styles.grid4)}>
          { carts && carts
            .filter((cart) => cart.archived)
            .filter((cart) => !cart.pined)
            .map((cart) => 
              <Cart key={cart.id} id={cart.id} title={cart.title} 
                gridType={gridType} description={cart.description} 
                pined={cart.pined}
                onChangePin={onChangePin}
                onRemoveCart={onRemoveCart}
              />
            )
          }
        </div>
    </div>
  );
};

export default ArchiveCartLayout;
