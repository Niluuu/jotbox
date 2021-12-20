import { FC, useRef, useState } from 'react';
import classNames from 'classnames';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import { InputNavbar } from '../input/InputNavbar';
import { TrashInputNavbar } from '../input/TrashInputNavbar';
import Modal from '../modal/Modal';
import MainEditor from '../../modules/Editor/MainEditor';
import './Color.scss'

interface CartProps {
  id: any;
  title: string;
  description: any;
  gridType: boolean;
  pined: boolean;
  isTrashPage?: boolean;
  gaps?: any[];
  trashed: boolean;
  color: string;
  onHyperLinkEditMode?: () => void;
  onRemoveCart?: (id: any) => void;
  onChangePin?: (id: any, title: string, description: any) => void;
  onReSetCart?: (id: any, title: string, description: any) => void;
  onChangeArchived?: (id: any, title: string, description: any) => void;
  onRestoreTrash?: (id: any) => void;
  onRemoveTrash?: (id: any) => void;
  onSetIsMain?: (bool: boolean) => void;
  onLabelEdit?: () => void;
  labelEdit?: boolean;
  onCartLabel?: (value: string) => void;
  cartLabel?: string;
  onSetLabel?: (id, oldGaps: string[]) => void;
  filteredGaps?: any[];
  onColorChange?: (id: any, color: string) => void;
}

const Cart: FC<CartProps> = ({
  id,
  title,
  pined,
  description,
  gridType,
  gaps,
  trashed,
  color,
  isTrashPage,
  onChangePin,
  onChangeArchived,
  onRestoreTrash,
  onRemoveTrash,
  onSetIsMain,
  onRemoveCart,
  onReSetCart,
  onHyperLinkEditMode,
  onCartLabel,
  cartLabel,
  onSetLabel,
  onColorChange,
  filteredGaps,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen((pre) => !pre);

  const cartTitleRef = useRef<HTMLParagraphElement>();
  const cartTextRef = useRef<HTMLParagraphElement>();
  // console.log("cart description", description)
  return (
    <>
      <div id={id} className={classNames(styles.cart, gridType && styles.column, color)}>
        <div className={styles.cart_content} onClick={() => setIsOpen(true)}>
          <div className={styles.cart_title}>
            <p> {title} </p>
            {!isTrashPage && (
              <button
                type="button"
                onClick={() => onChangePin(id, title, description)}
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
          {description && <MainEditor color={color} initialState={description} />}
        </div>
        <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
        <div className={styles.main_chips}>
          {gaps && gaps.map((gap) => <Chip onDelate={() => console.log('delate')}> {gap} </Chip>)}
        </div>
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
                setIsOpen(true);
                onHyperLinkEditMode();
              }}
              onChangeArchived={() => onChangeArchived(id, title, description)}
              ontoggle={() => setIsOpen(false)}
              onCartLabel={onCartLabel}
              cartLabel={cartLabel}
              onSetLabel={(oldGaps: string[]) => onSetLabel(id, oldGaps)}
              filteredGaps={filteredGaps}
              onColorChange={(currentColor) => onColorChange(id, currentColor)}
              currentColor={color}
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
              {!isTrashPage && (
                <button
                  type="button"
                  onClick={() => onChangePin(id, title, description)}
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
                onChangeArchived={() => onChangeArchived(id, title, description)}
                onSetIsMain={onSetIsMain}
                ontoggle={() => {
                  onReSetCart(id, cartTitleRef.current.innerText, cartTextRef.current.innerHTML);
                  setIsOpen(false);
                }}
                onCartLabel={onCartLabel}
                cartLabel={cartLabel}
                onSetLabel={(oldGaps: string[]) => onSetLabel(id, oldGaps)}
                filteredGaps={filteredGaps}
                onColorChange={(currentColor) => onColorChange(id, currentColor)}
                currentColor={color}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Cart;
