import { createRef, FC, forwardRef, useCallback, useRef, useState } from 'react';
import { Link, NavLink, Redirect } from "react-router-dom"
import classNames from 'classnames';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from './CartLayout';
import Modal from '../../component/modal/Modal';

export interface HomePageProps {
  gridType: boolean;
}

const carts = [
  {
    id: '1',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '2',
    title: 'tiele222',
    text: 'text2222',
    link: 'link3333',
    img: 'ss3333',
    chips: null,
  },
  {
    id: '3',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '4',
    title: 'tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222 tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222 tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222 tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222 tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222 tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222 tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222',
    text:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    link: 'link3333',
    img: 'ss3333',
    chips: ['gap1', 'gap1', 'gap1', 'gap1', 'gap1', 'gap1', 'gap1', 'gap1', 'gap1'],
  },
  {
    id: '5',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '6',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '7',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '8',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '9',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '10',
    title: 'tiele222',
    text: 'text2222',
    link: 'link3333',
    img: 'ss3333',
    chips: null,
  },
  {
    id: '11',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '12',
    title: 'tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222',
    text:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    link: 'link3333',
    img: 'ss3333',
    chips: ['gap1', 'gap1', 'gap1', 'gap1', 'gap1', 'gap1', 'gap1', 'gap1', 'gap1'],
  },
  {
    id: '13',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '14',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '15',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
  {
    id: '16',
    title: 'tiele',
    text: 'text',
    link: 'link',
    img: null,
    chips: ['gap1'],
  },
];

const HomePage: FC<HomePageProps> = ( { gridType } ) => {
  const [cart, setCart] = useState<any>(carts)

  const [otherOptions, setOtherOptions] = useState(false);
  const [hyperLinkEditMode, setHyperLinkEditMode] = useState(false);
  const [hyperText, setHyperText] = useState('');
  const [hyperLink, setHyperLink] = useState('');
  const [text, setText] = useState([]);
  const [link, setLink] = useState('');
  const textRef = useRef<HTMLDivElement>()

  const onOptionEditMode = useCallback(() => { 
    setOtherOptions(pre => !pre)
    setHyperLinkEditMode(false)
  }, [otherOptions]);

  const onHyperLinkEditMode = useCallback(() => {
    setHyperLinkEditMode(true)
    setOtherOptions(false)
  }, [hyperLinkEditMode])
  const onSetHyperLink = () => {
    setText([...text, { text: hyperText, link: hyperLink }])
    setLink(hyperLink)
    setHyperLinkEditMode(pre => !pre)
  }
  const onSetCart = () => {
    setCart(pre => [{
      id: Math.random(),
      title: 'great title',
      text: textRef.current.innerHTML,
      link: 'link',
      img: null,
      chips: ['gap1'],
    }, ...pre])
  }  
  return (
    <div className={classNames(styles.home_page, gridType ? styles.grid4: null)}>
      <div className={styles.home_page__main_input}>
        <MainInput onSetCart={onSetCart} hyperLinkEditMode={hyperLinkEditMode} textRef={textRef} gridType={gridType} onOptionEditMode={onOptionEditMode} text={text} link={link} />
        { otherOptions && 
          <ul className={styles.other_options}>
            <li onClick={onHyperLinkEditMode}> Add Link </li>
            <li> Option 2 </li>
            <li> Option 3</li>
          </ul> }
          <Modal title="Изменение ярлыков" isOpen={hyperLinkEditMode} toggleModal={onHyperLinkEditMode}>
            <div className={styles.gaps}> 
              Text
              <input style={{width: "100%"}} value={hyperText} onChange={e => setHyperText(e.currentTarget.value)} /> <br />
            </div> 
            <div className={styles.gaps}>
              Link
              <input style={{width: "100%"}} value={hyperLink} onChange={e => setHyperLink(e.currentTarget.value)} /> <br />
            </div> 
            <div className={styles.bottom_btn}>
              <button type="button" onClick={onSetHyperLink} >Done</button>
            </div>
          </Modal>
      </div>
      <CartLayout cart={cart} gridType={gridType} />
    </div>
  );
};

export default HomePage;
