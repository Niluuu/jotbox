import { FC, useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import { API, graphqlOperation } from 'aws-amplify';
import styles from './HomePage.module.scss';
import CartLayout from './CartLayout';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import { deleteTodo } from '../../graphql/mutations';

export interface TrashPageProps {
  gridType: boolean;
}

const fakeArchieveItem = {
  id: Date.now(),
  name: "trashTitle",
  description: "trashText"
}

const TrashPage: FC<TrashPageProps> = ({ gridType }) => {
  const [carts, setCart] = useState<any>([fakeArchieveItem]);

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
    // fetchTodos();
  // }, []);

  return (
    <div className={classNames(styles.home_page, gridType && styles.grid4)}>
      <p> Items in Trash will expire after 7 days </p>
      <CartLayout isTrash={!!true} carts={carts} gridType={gridType} />
    </div>
  );
};

export default TrashPage;
