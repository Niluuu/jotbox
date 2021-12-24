import { FC, useState } from 'react';
import classNames from 'classnames';
import styles from './HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';

interface CartModalProps {
   isTrashPage?: any;
}

const CartModal: FC<CartModalProps> = ({isTrashPage}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen((pre) => !pre);
  const [node, setNode] = useState({})

  const { id, title, description, pined } = cart
  return (
    <Modal
      isLarge={!!true}
      isOpen={isOpen}
      removeIcon={!isTrashPage && true}
      toggleModal={toggleModal}
    >
      <div id={id} className={classNames(styles.cart, styles.popup)}>
        <div className={styles.cart_content} onClick={() => setIsOpen(true)}>
          <div className={styles.cart_title}>
            <p>title </p>

            {!isTrashPage && (
              <button
                type="button"
                // onClick={() => onChangePin(id)}
                className={styles.icon_btn}
              >
                {!pined ? (
                  <Icon name="pin" color="premium" size="xs" />
                ) : (
                  <Icon name="pin-black" color="premium" size="xs" />
                )}
              </button>
            )}
          </div>
          <div className={styles.main_chips} />
        </div>
        <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
        {/* <div className={styles.input_navbar}>
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
              withHistory={!!true}
              onHyperLinkEditMode={onHyperLinkEditMode}
              onChangeArchived={() => onChangeArchived(id, title, description)}
              onSetIsMain={onSetIsMain}
              ontoggle={() => {
                // onResetNodes(id, cartTitleRef.current.innerText, "sads");
                setIsOpen(false);
              }}
              onCartLabel={onCartLabel}
              cartLabel={cartLabel}
              onSetLabel={(oldGaps: string[]) => onSetLabel(id, oldGaps)}
              filteredGaps={filteredGaps}
            />
          )}
        </div> */}
      </div>
    </Modal>
  );
};

export default CartModal;
