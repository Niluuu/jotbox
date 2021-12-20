import { FC } from 'react';
import classNames from 'classnames';
import styles from '../../component/cart-layout/CartLayout.module.scss';
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
      Trash Layout
    </div>
  );
};

export default TrashCartLayout;
