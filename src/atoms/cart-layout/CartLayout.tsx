/* eslint-disable react/require-default-props */
import { FC, useCallback } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './CartLayout.module.scss';
import Cart from '../../component/cart/Cart';
import { getModalNode } from '../../reducers/getNodeId';

interface CartProps {
  _version: number;
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  labels: string[];
  color: string;
  collabarators: string[];
  collabarator: string;
  _deleted: boolean;
  img: string[];
}

interface CartLayoutProps {
  /**
   * Grid type layout
   */
  gridType: boolean;
  /**
   * Nodes
   */
  carts: CartProps[];
  archivePage?: boolean;
}

const CartLayout: FC<CartLayoutProps> = ({ gridType, carts, archivePage }) => {
  const { label } = useParams();
  const dispatch = useDispatch();
  const labeledCarts =
    label !== undefined ? carts.filter((cart) => cart.labels.includes(label)) : carts;

  const { t } = useTranslation();

  const onOpenModal = useCallback(
    (cart: CartProps) => {
      dispatch(getModalNode(cart));
    },
    [dispatch],
  );

  return (
    <div className={classNames(styles.layout, gridType && styles.column)}>
      {!archivePage && labeledCarts.some((cart) => cart.pined) && (
        <div className={classNames(styles.layout_div, gridType && styles.column)}>
          <h1 className={styles.layout_title}>{t('pined')}</h1>
        </div>
      )}
      {labeledCarts && (
        <div className={classNames(styles.carts_layout, gridType && styles.column)}>
          {labeledCarts
            .filter((cart) => cart.pined)
            .map((cart) => (
              <Cart
                key={`key-${cart.id}`}
                id={cart.id}
                labels={cart.labels}
                title={cart.title}
                description={cart.description}
                pined={cart.pined}
                color={cart.color}
                collabarators={cart.collabarators}
                /* eslint no-underscore-dangle: 0 */
                _version={cart._version}
                archived={cart.archived}
                gridType={gridType}
                onOpenModal={() => onOpenModal(cart)}
                img={cart.img}
              />
            ))}
        </div>
      )}
      {!archivePage && labeledCarts.some((cart) => !cart.pined) && (
        <div className={classNames(styles.layout_div, gridType && styles.column)}>
          <h1 className={styles.layout_title}>{t('notes')}</h1>
        </div>
      )}
      {labeledCarts && (
        <div className={classNames(styles.carts_layout, gridType && styles.column)}>
          {labeledCarts
            .filter((cart) => !cart.pined)
            .map((cart) => (
              <Cart
                key={`key-${cart.id}`}
                id={cart.id}
                title={cart.title}
                labels={cart.labels}
                description={cart.description}
                pined={cart.pined}
                color={cart.color}
                collabarators={cart.collabarators}
                /* eslint no-underscore-dangle: 0 */
                _version={cart._version}
                archived={cart.archived}
                gridType={gridType}
                onOpenModal={() => onOpenModal(cart)}
                img={cart.img}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CartLayout;
