import { FC } from 'react';
import classNames from 'classnames';
import styles from './CartLayout.module.scss';
import Cart from '../../component/cart/Cart';

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
    title: 'tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222',
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
    title: 'tiessssssssssssssssssssssssssssssssssssssssssssssssssssssle222',
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
];

interface CartLayoutProps {
  isLogin?: boolean;
  gridType: boolean;
}

const CartLayout: FC<CartLayoutProps> = ({ isLogin, gridType }) => {
  return (
    <div className={classNames(styles.layout, gridType? styles.grid4 : null)}>
      <h1 className={styles.layout_title}>Архив</h1>
      <div className={classNames(styles.carts_layout, gridType? styles.grid4 : null)}>
        {carts &&
          carts.map(({ id, title, text, link, img, chips }) => (
            <Cart key={id} id={id} title={title} text={text} 
              link={link} img={img} chips={chips} gridType={gridType} />
          ))}
      </div>
    </div>
  );
};

export default CartLayout;
