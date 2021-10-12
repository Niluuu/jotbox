import { FC, useState } from 'react';
import classNames from 'classnames';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import { InputNavbar } from '../input/InputNavbar';
import Modal from '../modal/Modal';

interface CartProps {
  cart: any;
  gridType: boolean;
}

const Cart: FC<CartProps> = ({ cart, gridType }) => {
  const { chips, name, description, id } = cart;
  const chipLength = chips && chips.length;
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen((pre) => !pre);

  const Content = () => {
    return (
      <>
        <div className={styles.cart_content}>
          <div className={styles.cart_title}>
            <h1> {name}</h1>
            <button type="button" className={styles.icon_btn}>
              <Icon name="pin" color="premium" size="xs" />
            </button>
          </div>
          <span className={styles.cart_text} dangerouslySetInnerHTML={{ __html: description }} />
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
        <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
        <div className={styles.input_navbar}>
          <InputNavbar withHistory={!!true} ontoggle={() => setIsOpen(false)} />
        </div>
      </>
    );
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        id={id}
        className={classNames(styles.cart, gridType && styles.grid4)}
      >
        <Content />
      </div>
      <Modal isLarge={!!true} title="Изменить Заметку" isOpen={isOpen} toggleModal={toggleModal}>
        <div id={id} className={classNames(styles.cart, styles.popup)}>
          <Content />
        </div>
      </Modal>
    </>
  );
};

export default Cart;
