import { FC, useState } from 'react';
import classNames from 'classnames';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import { InputNavbar } from '../input/InputNavbar';
import { TrashInputNavbar } from '../input/TrashInputNavbar';
import Modal from '../modal/Modal';

interface CartProps {
  id: any;
  title: string;
  description: string;
  gridType: boolean;
  pinned: boolean;
  isTrash?: boolean;
  onRemoveCart: (id: any) => void;
  onChangePin: (id: any) => void;
}

const Cart: FC<CartProps> = ({
  id,
  title,
  pinned,
  description,
  gridType,
  isTrash,
  onChangePin,
  onRemoveCart,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen((pre) => !pre);

  const Content = () => {
    return (
      <>
        <div className={styles.cart_content} onClick={() => setIsOpen(true)}>
          <div className={styles.cart_title}>
            <h1> {title} </h1>
            {!isTrash && (
              <button type="button" onClick={() => onChangePin(id)} className={styles.icon_btn}>
                {!pinned ? (
                  <Icon name="pin" color="premium" size="xs" />
                ) : (
                  <svg
                    className={styles.pinned}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="#000"
                      d="M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
          <span className={styles.cart_text} dangerouslySetInnerHTML={{ __html: description }} />
          <div className={styles.main_chips} />
        </div>
        <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
        <div className={styles.input_navbar}>
          {isTrash ? (
            <TrashInputNavbar withHistory={!!true} ontoggle={() => setIsOpen(false)} />
          ) : (
            <InputNavbar
              onRemoveCart={() => onRemoveCart(id)}
              isOpen={isOpen}
              withHistory={!!true}
              ontoggle={() => setIsOpen(false)}
            />
          )}
        </div>
      </>
    );
  };

  const isTrashed = !isTrash && true;
  return (
    <>
      <div id={id} className={classNames(styles.cart, gridType ? styles.grid4 : null)}>
        <Content />
      </div>
      <Modal isLarge={!!true} removeIcon={isTrashed} isOpen={isOpen} toggleModal={toggleModal}>
        <div id={id} className={classNames(styles.cart, styles.popup)}>
          <Content />
        </div>
      </Modal>
    </>
  );
};

export default Cart;
