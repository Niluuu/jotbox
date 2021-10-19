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
  pined: boolean;
  isTrashPage?: boolean;
  onRemoveCart?: (id: any) => void;
  onChangePin?: (id: any) => void;
  onChangeArchived?: (id: any) => void;
  onRestoreTrash?: (id: any) => void;
  onRemoveTrash?: (id: any) => void;
}

const Cart: FC<CartProps> = ({
  id,
  title,
  pined,
  description,
  gridType,
  isTrashPage,
  onChangePin,
  onChangeArchived,
  onRestoreTrash,
  onRemoveTrash,
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
            {!isTrashPage && (
              <button type="button" onClick={() => onChangePin(id)} className={styles.icon_btn}>
                {!pined ? (
                  <Icon name="pin" color="premium" size="xs" />
                ) : (
                  <Icon name="pin-black" color="premium" size="xs" />
                )}
              </button>
            )}
          </div>
          <span className={styles.cart_text} dangerouslySetInnerHTML={{ __html: description }} />
          <div className={styles.main_chips} />
        </div>
        <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
        <div className={styles.input_navbar}>
          {isTrashPage ? (
            <TrashInputNavbar
              onRestoreTrash={() => onRestoreTrash(id)}
              onRemoveTrash={() => onRemoveTrash(id)}
              withHistory={!!true}
              ontoggle={() => setIsOpen(false)}
            />
          ) : (
            <InputNavbar
              onRemoveCart={() => onRemoveCart(id)}
              isOpen={isOpen}
              withHistory={!!true}
              isMainInput={!true}
              onChangeArchived={() => onChangeArchived(id)}
              ontoggle={() => setIsOpen(false)}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div id={id} className={classNames(styles.cart, gridType ? styles.grid4 : null)}>
        <Content />
      </div>
      <Modal
        isLarge={!!true}
        removeIcon={!isTrashPage && true}
        isOpen={isOpen}
        toggleModal={toggleModal}
      >
        <div id={id} className={classNames(styles.cart, styles.popup)}>
          <Content />
        </div>
      </Modal>
    </>
  );
};

export default Cart;
