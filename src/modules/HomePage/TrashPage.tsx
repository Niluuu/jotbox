import { FC, useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import { API, graphqlOperation } from 'aws-amplify';
import styles from './HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
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

  // async function fetchTodos() {
  //   try {
  //     // const todoData = await API.graphql(graphqlOperation(listTodos));
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     //  @ts-ignore
  //     // const todos = todoData.data.listTodos.items;
  //     // setCart(todos);
  //   } catch (err) {
  //     console.log('error fetching todos');
  //   }
  // }

  // useEffect(() => {
  //   fetchTodos();
  // }, []);

  const onRemoveTrash = useCallback(
    async (id) => {
      try {
        const deletedCart = { id };
        setCart(carts.filter((cart) => cart.id !== id));
        await API.graphql(graphqlOperation(deleteTodo, { input: deletedCart }));
      } catch (err) {
        console.log('error deleting todo:', err);
      }
    },
    [carts],
  );

  const onRestoreTrash = useCallback(
    async (id) => {
      try {
        setCart(carts.filter((cart) => cart.id !== id));
        await API.graphql(
          graphqlOperation(createTodo, { input: carts.find((cart) => cart.id === id) }),
        );
      } catch (err) {
        console.log('error creating todo:', err);
      }
    },
    [carts],
  );

  return (
    <div className={classNames(styles.home_page, gridType && styles.grid4)}>
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
