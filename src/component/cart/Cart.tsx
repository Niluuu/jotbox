import { FC } from 'react';
import classNames from 'classnames';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import { InputNavbar } from '../input/InputNavbar';

interface CartProps {
  id: any;
  title: string;
  text: any;
  img: any;
  link: string;
  chips: any;
  gridType: boolean;
}

const Cart: FC<CartProps> = ({ id, title, text, link, img, chips, gridType }) => {
  const chipLength = chips && chips.length;
  
  return (
    <div className={classNames(styles.cart, gridType ? styles.grid4 : null)} id={id}>
      <Icon name="done" color="premium" className={styles.done_icon} size="xs" />

      <div className={styles.cart_content}>
        <div className={styles.cart_title}>
          <h1> 
            { !gridType  
              ? (title.length < 35 && title || `${title.slice(0, 35)}...`)
              : (title.length < 100 && title || `${title.slice(0, 100)}...`) }
          </h1>
          <button type="button" className={styles.icon_btn}>
            <Icon name="pin" color="premium" size="xs" />
          </button>
        </div>
        <div className={styles.cart_text}> 
          <span dangerouslySetInnerHTML={{__html: `${text.slice(0, 100)}...`}} />
        </div>

        <div className={styles.main_chips}>
          {chips &&
            chips.map((chip, i) =>
              i < 3 ? (
                <Chip onDelate={(e) => console.log(e)} delateIcon>
                  {chip} 
                </Chip>
              ) : null,
            )}
          {chipLength > 3 ? 
            <div className={styles.chips_length}> +{chipLength - 3}</div> : null}
        </div>
      </div>
      <div className={styles.input_navbar}>
        <InputNavbar />
      </div>
    </div>
  );
};

export default Cart;
