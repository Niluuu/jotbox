import { FC, useCallback, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { API, graphqlOperation } from 'aws-amplify';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from './CartLayout';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import { createTodo, deleteTodo, updateTodo } from '../../graphql/mutations';
import { listTodos } from '../../graphql/queries';

export interface HomePageProps {
  gridType: boolean;
}

const HomePage: FC<HomePageProps> = ({ gridType }) => {
  const [carts, setCart] = useState<any>([]);
  const [focused, setFocused] = useState(false);

  const [hyperLinkEditMode, setHyperLinkEditMode] = useState(false);

  const [hyper, setHyper] = useState([]);
  const [hyperText, setHyperText] = useState('');
  const [hyperLink, setHyperLink] = useState('');

  const [defaultPin, setDefaultPin] = useState(false);
  const onDefaultPin = useCallback(() => {
    setDefaultPin(pre => !pre)
  }, [defaultPin])

  const titleRef = useRef<HTMLDivElement>();
  const textRef = useRef<HTMLDivElement>();

  const [textFocus, setTextFocus] = useState(false);
  const [linkFocus, setLinkFocus] = useState(false);
  
  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const todos = todoData.data.listTodos.items;
      
      setCart(todos);
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const onHyperLinkEditMode = useCallback(() => {
    setHyperLinkEditMode(true);
  }, [hyperLinkEditMode]);

  const onSetHyperLink = () => {
    setHyperText('');
    setHyperLink('');
    setTimeout(() => setFocused(true), 50);
    setHyper([...hyper, { text: hyperText, link: hyperLink }]);
    setHyperLinkEditMode((pre) => !pre);
  };

  const onRemoveCart = useCallback(async (id) => {
    try {
      const deletedCart = { id }
      setCart(carts.filter(cart => cart.id !== id))
      await API.graphql(graphqlOperation(deleteTodo, { input: deletedCart }));
    } catch (err) {
      console.log('error deleting todo:', err);
    }
  }, [carts]) 

  const onChangePin = useCallback(async (id) => {
    try {
      setCart(carts.map((cart) => cart.id === id ? { ...cart, pined: !cart.pined } : cart))
      // await API.graphql(graphqlOperation(updateTodo, {  }));
    } catch (err) {
      console.log('error updating todo:', err);
    }
  }, [carts]) 

  const onChangeArchived = useCallback(async (id) => {
    try {
      setCart(carts.map((cart) => cart.id === id ? { ...cart, archived: !cart.archived } : cart))
      // await API.graphql(graphqlOperation(updateTodo, {  }));
    } catch (err) {
      console.log('error updating todo:', err);
    }
  }, [carts]) 

  const onSetCart = useCallback(async () => {
    try {
      const cart = {
        id: Date.now(),
        title: titleRef.current.innerText,
        description: textRef.current.innerHTML,
        pined: defaultPin,
        archived: false,
        gaps: null
      };
      setCart([...carts, cart]);

      setDefaultPin(false)
      titleRef.current.innerHTML = '';
      textRef.current.innerHTML = '';

      await API.graphql(graphqlOperation(createTodo, { input: cart }));
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }, [carts, defaultPin]);

  const onSetArchive = useCallback(async () => {
    try {
      const cart = {
        id: Date.now(),
        title: titleRef.current.innerText,
        description: textRef.current.innerHTML,
        pined: false,
        archived: true,
        gaps: null
      };
      setCart([...carts, cart]);

      setDefaultPin(false)
      titleRef.current.innerHTML = '';
      textRef.current.innerHTML = '';

      await API.graphql(graphqlOperation(createTodo, { input: cart }));
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }, [carts, defaultPin]);

  const onCloseModal = useCallback(() => {
    setHyperText('');
    setHyperLink('');
    setHyperLinkEditMode(false);
  }, [hyperLinkEditMode]);

  return (
    <div className={classNames(styles.home_page, gridType && styles.grid4)}>
      <div className={styles.home_page__main_input}>
        <MainInput focused={focused} setFocused={(e) => setFocused(e)}
          onHyperLinkEditMode={onHyperLinkEditMode} 
          onSetArchive={onSetArchive} onSetCart={onSetCart} 
          titleRef={titleRef} hyperLinkEditMode={hyperLinkEditMode} 
          textRef={textRef} gridType={gridType} 
          defaultPin={defaultPin} onDefaultPin={onDefaultPin}
          hyper={hyper} />
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
      <CartLayout
        onChangePin={onChangePin}
        onChangeArchived={onChangeArchived}
        onRemoveCart={onRemoveCart}
        carts={carts}
        gridType={gridType}
      />
    </div>
  );
};

export default HomePage;

export const urlify = (str) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return str.replace(urlRegex, (url) => {
    return `<a style="color: blue;" href="${url}" > ${url} </a> `;
  });
};
