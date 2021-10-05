import { FC } from 'react';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import { InputNavbar } from '../input/InputNavbar';

interface CartProps {
  id: any;
  title: string;
  text: string;
  img: any;
  link: string;
  chips: any;
}

const Cart: FC<CartProps> = ({ id, title, text, link, img, chips }) => {
  const chipLength = chips && chips.length;

  return (
    <div className={styles.cart} id={id}>
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

export default Cart;
