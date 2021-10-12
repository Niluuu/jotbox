import { FC, useCallback, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import styles from './HomePage.module.scss';
import awsExports from '../../aws-exports';
import MainInput from '../../component/input/MainInput';
import CartLayout from './CartLayout';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import { createTodo } from '../../graphql/mutations';
import { listTodos } from '../../graphql/queries';

Amplify.configure(awsExports);

export interface HomePageProps {
  gridType: boolean;
}

const HomePage: FC<HomePageProps> = ({ gridType }) => {
  const [carts, setCart] = useState<any>([]);

  const [hyperLinkEditMode, setHyperLinkEditMode] = useState(false);
  const [hyperText, setHyperText] = useState('');
  const [hyperLink, setHyperLink] = useState('');
  const [hyper, setHyper] = useState([]);
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

      console.log('todos', todos);
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
    setHyper([...hyper, { text: hyperText, link: hyperLink }]);
    setHyperLinkEditMode((pre) => !pre);
  };

  const onSetCart = useCallback(async () => {
    try {
      // if (titleRef.current.innerText && textRef.current.innerText) return;

      const cart = {
        id: Date.now(),
        name: titleRef.current.innerText,
        description: textRef.current.innerHTML,
      };
      setCart([...carts, cart]);

      titleRef.current.innerHTML = '';
      textRef.current.innerHTML = '';

      await API.graphql(graphqlOperation(createTodo, { input: cart }));
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }, [carts]);

  const onCloseModal = () => {
    setHyperText('');
    setHyperLink('');
    setHyperLinkEditMode(false);
  };

  return (
    <div className={classNames(styles.home_page, gridType && styles.grid4)}>
      <div className={styles.home_page__main_input}>
        <MainInput
          onHyperLinkEditMode={onHyperLinkEditMode}
          onSetCart={onSetCart}
          hyperLinkEditMode={hyperLinkEditMode}
          titleRef={titleRef}
          textRef={textRef}
          gridType={gridType}
          hyper={hyper}
        />
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
            {textFocus ? <Icon name="done" color="premium" size="xs" /> : null}
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
            {linkFocus ? <Icon name="done" color="premium" size="xs" /> : null}
          </div>
          <div className={styles.bottom_btn} onClick={onSetHyperLink}>
            <button type="button">Done</button>
          </div>
        </Modal>
      </div>
      <CartLayout carts={carts} gridType={gridType} />
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
