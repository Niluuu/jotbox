import { FC, useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import { API, graphqlOperation } from 'aws-amplify';
import styles from '../HomePage/HomePage.module.scss';
import { createTodo, deleteTodo } from '../../graphql/mutations';
import TrashCartLayout from './TrashCartLayout';

export interface TrashPageProps {
  gridType: boolean;
}

const TrashPage: FC<TrashPageProps> = ({ gridType }) => {
  const [carts, setCart] = useState<any>([
    {
      id: Date.now(),
      title: 'Trash',
      description: 'Its Trash',
      gaps: null,
      pined: false,
      archived: false,
    },
  ]);

  const onRemoveTrash = useCallback(
    async (id) => {
      try {
        setCart(carts.filter((cart) => cart.id !== id));
      } catch (err) {
        console.log('error deleting todo:', err);
      }
    },
    [carts],
  );

  const onRestoreTrash = useCallback(
    async (id) => {
      try {
        const restoredTrash = carts.find((cart) => cart.id === id);
        setCart(carts.filter((cart) => cart.id !== id));

        await API.graphql(graphqlOperation(createTodo, { input: restoredTrash }));
      } catch (err) {
        console.log('error creating todo:', err);
      }
    },
    [carts],
  );

  return (
    <div className={classNames(styles.home_page, gridType && styles.column)}>
      <p> Notes in Trash will expire after 7 days </p>
      <TrashCartLayout
        onRemoveTrash={onRemoveTrash}
        onRestoreTrash={onRestoreTrash}
        carts={carts}
        gridType={gridType}
      />
    </div>
  );
};

export default TrashPage;
