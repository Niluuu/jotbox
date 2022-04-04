/* eslint-disable react/require-default-props */
import { FC, useCallback, useState, useRef } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import inputStyles from '../input/MainInput.module.scss';
import { InputNavbar } from '../input/InputNavbar';
import MainEditor from '../../modules/Editor/MainEditor';
import { getIdNode } from '../../reducers/getNodeId';
import './Color.scss';
import Popover from '../popover/Popover';

interface CartProps {
  /**
   * Node Id
   */
  id: string;
  /**
   * Node title
   */
  title: string;
  /**
   * Node description
   */
  description: string;
  /**
   * Node is pined?
   */
  pined: boolean;
  /**
   * Node labels
   */
  labels?: string[] | null;
  /**
   * Node version of node
   */
  _version?: number;
  /**
   * Node archived or not?
   */
  archived: boolean;
  /**
   * Node color
   */
  color: string;
  /**
   * Delete node
   */
  onRemoveCart?: (id: string, _version: number) => void;
  /**
   * Toggle node pined
   */
  onChangePin?: (id: string, pined: boolean, _version: number) => void;
  /**
   * Change node archived
   */
  onChangeArchived?: (
    id: string,
    archived: boolean,
    _version: number,
    title: string,
    description: string,
  ) => void;
  /**
   * Node color change func
   */
  onColorChange?: (id: string, color: string, _version: number) => void;
  /**
   * Layout type for cart size
   */
  gridType: boolean;
  /**
   * ?
   */
  popupCart?: boolean;
  /**
   * Toggle labels of Node function
   */
  toggleCartLabels?: (id: string, _version: number, label: string) => void;
  /**
   * Collobarators of the Node Cart
   */
  collabarators: string[];
}

const Cart: FC<CartProps> = (props) => {
  const {
    id,
    title,
    pined,
    description,
    labels,
    _version,
    onChangePin,
    onChangeArchived,
    onRemoveCart,
    gridType,
    popupCart,
    color,
    onColorChange,
    toggleCartLabels,
    archived,
    collabarators,
  } = props;
  const [isMain] = useState(false);
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const onOpenModal = useCallback(
    (nodeId) => {
      dispatch(getIdNode(nodeId));
    },
    [dispatch],
  );

  const isLarge = !title;

  const userEmail = localStorage.getItem('userEmail');
  return (
    <div className={styles.cart_wrapper}>
      <div
        id={id}
        className={classNames(
          styles.cart,
          color,
          gridType && styles.column,
          popupCart && styles.popupCart,
        )}
      >
        <button type="button" className={classNames(styles.icon_btn, styles.pin)}>
          <Icon
            onClick={() => onChangePin(id, !pined, _version)}
            name={pined ? 'pin-black' : 'pin'}
            color="premium"
            size="xs"
          />
        </button>
        <div onClick={() => !popupCart && onOpenModal(id)} className={styles.cart_content}>
          {title && (
            <div className={classNames(styles.cart_title)}>
              <p>{title}</p>
            </div>
          )}
          {description && (
            <MainEditor
              isLarge={isLarge}
              color={color}
              initialState={description}
              editorRef={editorRef}
              readOnly
            />
          )}
        </div>
        <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
        {labels.length !== 0 && labels !== null && (
          <div className={styles.main_chips}>
            {labels.length > 2 ? (
              <>
                <Chip onDelate={() => toggleCartLabels(id, _version, labels[0])}>
                  {' '}
                  {labels[0]}{' '}
                </Chip>
                <Chip onDelate={() => toggleCartLabels(id, _version, labels[1])}>
                  {' '}
                  {labels[1]}{' '}
                </Chip>
                <div className={styles.extralabel}> +{labels.length - 2} </div>
              </>
            ) : (
              labels.map((label) => (
                <Chip onDelate={() => toggleCartLabels(id, _version, label)}> {label} </Chip>
              ))
            )}
          </div>
        )}
        {collabarators && (
          <div className={classNames(styles.main_chips, inputStyles.labels)}>
            {collabarators.length > 6 ? (
              <>
                {collabarators
                  .filter((e) => e !== userEmail)
                  .slice(0, 5)
                  .map((user) => (
                    <div className={inputStyles.user}>{user[0].toLowerCase()}</div>
                  ))}
                <div className={inputStyles.user}>{collabarators.length - 5}+</div>
              </>
            ) : (
              collabarators
                .filter((e) => e !== userEmail)
                .map((user) => <div className={inputStyles.user}>{user[0].toLowerCase()}</div>)
            )}
          </div>
        )}
        <div className={styles.input_navbar}>
          <InputNavbar
            isCart
            onOpenModal={() => onOpenModal(id)}
            isMainInput={isMain}
            currentColor={color}
            selectedLabels={labels}
            onRemoveCart={() => onRemoveCart(id, _version)}
            onColorChange={(currentColor) => onColorChange(id, currentColor, _version)}
            toggleCartLabels={(label) => toggleCartLabels(id, _version, label)}
            onChangeArchived={() => onChangeArchived(id, !archived, _version, title, description)}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
