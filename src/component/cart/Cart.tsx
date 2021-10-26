import { FC, useRef, useState } from 'react';
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
  cartHyper?: any;
  onHyperLinkEditMode?: () => void;
  onRemoveCart?: (id: any) => void;
  onChangePin?: (id: any, title: string, description: any) => void;
  onReSetCart?: (id: any, title: string, description: any) => void;
  onChangeArchived?: (id: any, title: string, description: any) => void;
  onRestoreTrash?: (id: any) => void;
  onRemoveTrash?: (id: any) => void;
  onSetIsMain?: (bool: boolean) => void;
}

const Cart: FC<CartProps> = ({
  id,
  title,
  pined,
  description,
  gridType,
  isTrashPage,
  cartHyper,
  onChangePin,
  onChangeArchived,
  onRestoreTrash,
  onRemoveTrash,
  onSetIsMain,
  onRemoveCart,
  onReSetCart,
  onHyperLinkEditMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen((pre) => !pre);
  
  const cartTitleRef = useRef<HTMLParagraphElement>();
  const cartTextRef = useRef<HTMLParagraphElement>();

  return (
    <>
      <div id={id} className={classNames(styles.cart, gridType && styles.column)}>
        <div className={styles.cart_content} onClick={() => setIsOpen(true)}>
          <div className={styles.cart_title}>
            <p> {title} </p>
            {!isTrashPage && (
              <button type="button" onClick={() => onChangePin(id, title, description)} className={styles.icon_btn}>
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
              withHistory={!!true}
              isMainInput={!true}
              onSetIsMain={onSetIsMain}
              onHyperLinkEditMode={() => {
                setIsOpen(true)
                onHyperLinkEditMode()
              }}
              onChangeArchived={() => onChangeArchived(id,  title, description)}
              ontoggle={() => setIsOpen(false)}
            />
          )}
        </div>
      </div>
      <Modal
        isLarge={!!true}
        isOpen={isOpen}
        removeIcon={!isTrashPage && true}
        toggleModal={toggleModal}
      >
        <div id={id} className={classNames(styles.cart, styles.popup)}>
          <div className={styles.cart_content} onClick={() => setIsOpen(true)}>
            <div className={styles.cart_title}>
              <p ref={cartTitleRef} contentEditable>
                {' '}
                {title}{' '}
              </p>
              {!isTrashPage && (
                <button type="button" onClick={() => onChangePin(id,  title, description)} className={styles.icon_btn}>
                  {!pined ? (
                    <Icon name="pin" color="premium" size="xs" />
                  ) : (
                    <Icon name="pin-black" color="premium" size="xs" />
                  )}
                </button>
              )}
            </div>
            <span className={styles.cart_text} contentEditable ref={cartTextRef}>
              <span dangerouslySetInnerHTML={{ __html: description }} />
              { cartHyper && cartHyper.map((hyp) => (
                <>
                  {' '}
                  <a href={hyp.link} style={{ color: 'blue' }}>
                    {hyp.text}
                  </a>{' '}
                </>
              ))}
            </span>
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
                withHistory={!!true}
                onHyperLinkEditMode={onHyperLinkEditMode}
                onChangeArchived={() => onChangeArchived(id,  title, description)}
                onSetIsMain={onSetIsMain}
                ontoggle={() => {
                  onReSetCart(id, cartTitleRef.current.innerText, cartTextRef.current.innerHTML);
                  setIsOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Cart;
