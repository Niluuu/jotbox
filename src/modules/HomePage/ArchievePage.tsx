import { FC, useCallback, useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { API, graphqlOperation } from 'aws-amplify';
import styles from './HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import { deleteTodo } from '../../graphql/mutations';
import { listTodos } from '../../graphql/queries';
import ArchiveCartLayout from './ArchiveCartLayout';

export interface ArchievePageProps {
  gridType: boolean;
}

const ArchievePage: FC<ArchievePageProps> = ({ gridType }) => {
  const [carts, setCart] = useState<any>([]);

  const [hyperLinkEditMode, setHyperLinkEditMode] = useState(false);

  const [hyper, setHyper] = useState([]);
  const [hyperText, setHyperText] = useState('');
  const [hyperLink, setHyperLink] = useState('');

  const [textFocus, setTextFocus] = useState(false);
  const [linkFocus, setLinkFocus] = useState(false);

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const todos = todoData.data.listTodos.items;

      setCart(todos.filter((todo) => todo.archived));
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const onSetHyperLink = () => {
    setHyperText('');
    setHyperLink('');
    setHyper([...hyper, { text: hyperText, link: hyperLink }]);
    setHyperLinkEditMode((pre) => !pre);
  };

  const onRemoveCart = useCallback(
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

  const onChangeArchived = useCallback(
    async (id) => {
      try {
        setCart(
          carts.map((cart) => (cart.id === id ? { ...cart, archived: false, pined: false } : cart)),
        );
        // await API.graphql(graphqlOperation(updateTodo, {  }));
      } catch (err) {
        console.log('error updating todo:', err);
      }
    },
    [carts],
  );

  const onChangePin = useCallback(
    async (id) => {
      try {
        setCart(
          carts.map((cart) =>
            cart.id === id ? { ...cart, pined: !cart.pined, archived: false } : cart,
          ),
        );
        // await API.graphql(graphqlOperation(updateTodo, {  }));
      } catch (err) {
        console.log('error updating todo:', err);
      }
    },
    [carts],
  );

  const onCloseModal = useCallback(() => {
    setHyperText('');
    setHyperLink('');
    setHyperLinkEditMode(false);
  }, [hyperLinkEditMode]);

  return (
    <div className={classNames(styles.home_page, gridType && styles.grid4)}>
      <div className={styles.home_page__main_input}>
        <Modal title="Добавить линк" isOpen={hyperLinkEditMode} toggleModal={onCloseModal}>
          <div className={styles.gaps}>
            <Icon name={textFocus ? 'exit' : 'add'} color="premium" size="xs" />
            <input
              type="text"
              value={hyperText}
              onChange={(e) => setHyperText(e.currentTarget.value)}
              placeholder="Введите текст..."
              onFocus={() => setTextFocus(true)}
              onBlur={() => setTextFocus(false)}
            />
            {textFocus && <Icon name="done" color="premium" size="xs" />}
          </div>
          <div className={styles.gaps}>
            <Icon name={linkFocus ? 'exit' : 'add'} color="premium" size="xs" />
            <input
              type="text"
              value={hyperLink}
              onChange={(e) => setHyperLink(e.currentTarget.value)}
              placeholder="Введите линк..."
              onFocus={() => setLinkFocus(true)}
              onBlur={() => setLinkFocus(false)}
            />
            {linkFocus && <Icon name="done" color="premium" size="xs" />}
          </div>
          <div className={styles.bottom_btn} onClick={onSetHyperLink}>
            <button type="button">Done</button>
          </div>
        </Modal>
      </div>
      <ArchiveCartLayout
        onChangeArchived={onChangeArchived}
        onChangePin={onChangePin}
        onRemoveCart={onRemoveCart}
        carts={carts}
        gridType={gridType}
      />
    </div>
  );
};

export default ArchievePage;
