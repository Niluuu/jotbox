import { createRef, FC, forwardRef, useCallback, useRef, useState } from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import classNames from 'classnames';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from './CartLayout';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';

export interface HomePageProps {
  gridType: boolean;
}

const carts = [
  {
    id: 1,
    title: 'first',
    text: 'first-first',
    link: 'link-first',
    img: null,
    chips: [],
  },
  {
    id: 2,
    title: 'second',
    text: 'second-second',
    link: 'link-second',
    img: null,
    chips: [],
  },
];

const HomePage: FC<HomePageProps> = ({ gridType }) => {
  const [cart, setCart] = useState<any>(carts);

  const [hyperLinkEditMode, setHyperLinkEditMode] = useState(false);
  const [hyperText, setHyperText] = useState('');
  const [hyperLink, setHyperLink] = useState('');
  const [hyper, setHyper] = useState([]);
  const titleRef = useRef<HTMLDivElement>();
  const textRef = useRef<HTMLDivElement>();

  const [textFocus, setTextFocus] = useState(false);
  const [linkFocus, setLinkFocus] = useState(false);

  const onHyperLinkEditMode = useCallback(() => {
    setHyperLinkEditMode(true);
  }, [hyperLinkEditMode]);

  const onSetHyperLink = () => {
    setHyperText('')
    setHyperLink('')
    setHyper([...hyper, { text: hyperText, link: hyperLink }]);
    setHyperLinkEditMode((pre) => !pre);
  };
  const onSetCart = useCallback(() => {
    if (titleRef.current.innerText && textRef.current.innerText) {
      new Promise((resolve, reject) => {
        setCart(pre => [
          { id: Date.now(), 
            title: titleRef.current.innerText,
            text: textRef.current.innerHTML, 
            link: 'link',
            img: null, 
            chips: [],
          },
          ...pre,
        ]);
        resolve(true);
      }).then((resolve) => {
        if (resolve) {
          titleRef.current.innerHTML = '';
          textRef.current.innerHTML = '';
        }
      });
    }
  }, [carts]);
  
  const onCloseModal = () => {
    setHyperText('')
    setHyperLink('')
    setHyperLinkEditMode(false)
  }
  return (
    <div className={classNames(styles.home_page, gridType ? styles.grid4 : null)}>
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
        <Modal
          title="Добавить линк"
          isOpen={hyperLinkEditMode}
          toggleModal={onCloseModal}>
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
      <CartLayout cart={cart} gridType={gridType} />
    </div>
  );
};

export default HomePage;

export const urlify = (str) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
    return str.replace(urlRegex, (url) => {
      return `<a style="color: blue;" href="${url}" > ${url} </a> `
    }
  )
} 