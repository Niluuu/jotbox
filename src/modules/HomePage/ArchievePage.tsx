import { FC, useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import { API, graphqlOperation } from 'aws-amplify';
import styles from './HomePage.module.scss';
import CartLayout from './CartLayout';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import { deleteTodo } from '../../graphql/mutations';

export interface ArchievePageProps {
  gridType: boolean;
}

const fakeArchieveItem = {
  id: Date.now(),
  name: "archieveTitle",
  description: "archieveText"
}

const ArchievePage: FC<ArchievePageProps> = ({ gridType }) => {
  const [carts, setCart] = useState<any>([fakeArchieveItem]);

  const [hyperLinkEditMode, setHyperLinkEditMode] = useState(false);
  
  const [hyper, setHyper] = useState([]);
  const [hyperText, setHyperText] = useState('');
  const [hyperLink, setHyperLink] = useState('');

  const [textFocus, setTextFocus] = useState(false);
  const [linkFocus, setLinkFocus] = useState(false);

  async function fetchTodos() {
    try {
      // const todoData = await API.graphql(graphqlOperation(listTodos));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      // const todos = todoData.data.listTodos.items;
      // setCart(todos);
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

  const onRemoveCart = useCallback(async (id) => {
    try {
      const deletedCart = { id }
      setCart(pre => pre.filter(cart => cart.id !== id))
      await API.graphql(graphqlOperation(deleteTodo, { input: deletedCart }));
    } catch (err) {
      console.log('error deleting todo:', err);
    }
  }, [carts]) 

  const onChangePin = useCallback(async (id) => {
    try {
      setCart(pre => pre.map((cart) => cart.id === id ? { ...cart, pinned: !cart.pinned } : cart))
    } catch (err) {
      console.log('error updating todo:', err);
    }
  }, [carts]) 

  const onCloseModal = useCallback(() => {
    setHyperText('');
    setHyperLink('');
    setHyperLinkEditMode(false);
  }, [hyperLinkEditMode]);

  return (
    <div className={classNames(styles.home_page, gridType && styles.grid4)}>
      <Modal title="Добавить линк" isOpen={hyperLinkEditMode} toggleModal={onCloseModal}>
        <div className={styles.gaps}>
          <Icon name={textFocus ? 'exit' : 'add'} color="premium" size="xs" />
          <input type="text" value={hyperText} placeholder="Введите текст..."
            onChange={(e) => setHyperText(e.currentTarget.value)}
            onFocus={() => setTextFocus(true)}
            onBlur={() => setTextFocus(false)} />
          { textFocus && <Icon name="done" color="premium" size="xs" /> }
        </div>
        <div className={styles.gaps}>
          <Icon name={linkFocus ? 'exit' : 'add'} color="premium" size="xs" />
          <input type="text" value={hyperLink} placeholder="Введите линк..."
            onChange={(e) => setHyperLink(e.currentTarget.value)}
            onFocus={() => setLinkFocus(true)}
            onBlur={() => setLinkFocus(false)} />
          { linkFocus && <Icon name="done" color="premium" size="xs" /> }
        </div>
        <div className={styles.bottom_btn} onClick={onSetHyperLink}>
          <button type="button">Done</button>
        </div>
      </Modal>
      <CartLayout onChangePin={onChangePin}
        onRemoveCart={onRemoveCart} carts={carts} gridType={gridType} />
    </div>
  );
};

export default ArchievePage;
