import { FC, useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Chip } from '../../component/chip/Chip';
import { Icon } from '../../component/Icon/Icon';
import styles from './CartLayout.module.scss';
import { InputNavbar } from '../../component/input/InputNavbar';

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
}

const CartLayout: FC<CartLayoutProps> = ({ isLogin }) => {
  const [cartPosition, setCartPosition] = useState(null);
  const [selected, setSelected] = useState([]);
  const arr = Array.from({ length: carts.length }, (x, i) => i * 6);

  useEffect(() => {
    setPositions();
    console.log(arr);
  }, []);

  const setPositions = useCallback(() => {
    const result = [];

    carts.forEach((item, i) => {
      const newObj = {};

      function height() {
        const base = item.text.length > 30 ? 600 : 200;
        const chip = item.chips ? 20 : 0;

        return base + chip;
      }

      Object.assign(newObj, {
        width: '240px',
        height: height(),
        trans: transform(),
        index: i,
      });

      function transform() {
        let v = 0;
        const y = 256;
        let calY = y * i;

        arr.map(function (num) {
          if (num !== 0 && num === i && i >= num) {
            const itemNumber = i - 6;
            v = result.find((elem) => elem.index === itemNumber).height + 40;
            calY = 0;
          }

          return `${calY}px, ${v}px`;
        });

        return `${calY}px, ${v}px`;
      }

      result.push({ ...newObj, ...item });
    });

    console.log('result', result);
    setCartPosition(result);
  }, [cartPosition]);

  return (
    <div className={styles.layout}>
      <h1 className={styles.layout_title}>Архив</h1>
      <div className={styles.carts_layout}>
        {cartPosition &&
          cartPosition.map(({ id, title, text, link, img, chips, trans, height }) => (
            <Cart
              key={id}
              id={id}
              title={title}
              text={text}
              link={link}
              img={img}
              chips={chips}
              trans={trans}
              height={height}
            />
          ))}
      </div>
    </div>
  );
};

interface CartProps {
  id: any;
  title: string;
  text: string;
  img: any;
  link: string;
  chips: any;
  trans: string;
  height: number;
}

const Cart: FC<CartProps> = ({ id, title, text, link, img, chips, trans, height }) => {
  const chipLength = chips && chips.length;
  return (
    <div
      className={styles.cart}
      id={id}
      style={{ width: `240px`, height: `${height}px`, transform: `translate(${trans})` }}
    >
      <Icon name="done" color="premium" className={styles.done_icon} size="xs" />

      <div className={styles.cart_content}>
        <div className={styles.cart_title}>
          <h1>{title}</h1>
          <button type="button" className={styles.icon_btn}>
            <Icon name="pin" color="premium" size="xs" />
          </button>
        </div>
        <div className={styles.cart_text}>{text}</div>

        <div className={styles.main_chips}>
          {chips &&
            chips.map((chip, i) =>
              i < 3 ? (
                <Chip onDelate={(e) => console.log(e)} delateIcon>
                  {chip}
                </Chip>
              ) : null,
            )}
          {chipLength > 3 ? <div className={styles.chips_length}> + {chipLength - 3}</div> : null}
        </div>
      </div>
      <div className={styles.input_navbar}>
        <InputNavbar />
      </div>
    </div>
  );
};

export default CartLayout;
