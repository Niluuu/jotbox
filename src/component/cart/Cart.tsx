/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { FC, useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { API, Storage } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import inputStyles from '../input/MainInput.module.scss';
import { InputNavbar } from '../input/InputNavbar';
import MainEditor from '../../modules/Editor/MainEditor';
import './Color.scss';
import { updateNode } from '../../graphql/mutations';
import { updateNodesToProps } from '../../reducers/nodes';
import CartImages from './CartImages';

interface CartProps {
  id: string; // Node Id
  _version?: number; // Node version of node
  title: string; // Node title
  description: string; // Node description
  pined: boolean; //  Node is pined?
  labels?: string[] | null; //  Node labels
  archived: boolean; // Node archived or not?
  color: string; // Node color
  gridType: boolean; // Layout type for cart size
  popupCart?: boolean; // ?
  collabarators: string[]; // Collobarators of the Node Cart
  onOpenModal: () => void;
  img: string[];
  checkouts?: Array<{
    id: string;
    title: string;
    checked: boolean;
  }>;
}

const Cart: FC<CartProps> = (props) => {
  const {
    id,
    title,
    pined,
    description,
    labels,
    _version,
    gridType,
    popupCart,
    color,
    archived,
    collabarators,
    onOpenModal,
    img,
    checkouts = [],
  } = props;
  const [images, setImages] = useState([]);
  const [isMain] = useState(false);
  const editorRef = useRef(null);
  const dispatch = useDispatch();

  const isLarge = !title;

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (img) {
      const requestedImages = img.map(async (image) => {
        const data = await Storage.get(image);
        return data;
      });

      Promise.all(requestedImages).then((values) => {
        setImages(values);
      });
    }
  }, [img]);

  const onChangePin = useCallback(async (): Promise<CartProps> => {
    try {
      const updatedNode = {
        id,
        pined: !pined,
        archived: false,
        _version,
      };

      const data = await API.graphql({
        query: updateNode,
        variables: { input: updatedNode },
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const item = data.data.updateNode;

      dispatch(updateNodesToProps(item));

      return item;
    } catch (err) {
      throw new Error('Update node error');
    }
  }, [_version, dispatch, id, pined]);

  const toggleCartLabels = useCallback(
    async (nodeLabels: string): Promise<CartProps> => {
      try {
        const updatedlabels = labels.includes(nodeLabels)
          ? labels.filter((cartlabel: string) => cartlabel !== nodeLabels)
          : [...labels, nodeLabels];

        const updatedNode = { id, _version, labels: updatedlabels };

        const newData = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = newData.data.updateNode;

        dispatch(updateNodesToProps(item));

        return item;
      } catch (err) {
        throw new Error('Toggle Update Label for Carts Error');
      }
    },
    [_version, dispatch, id, labels],
  );

  const toggleCartCheckouts = useCallback(
    async (checkoutId): Promise<CartProps> => {
      try {
        const updatedCheckouts = checkouts.map((checkout) =>
          checkout.id === checkoutId ? { ...checkout, checked: !checkout.checked } : checkout,
        );

        const updatedNode = { id, _version, todo: JSON.stringify(updatedCheckouts) };

        const newData = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = newData.data.updateNode;

        dispatch(updateNodesToProps(item));

        return item;
      } catch (err) {
        throw new Error('Toggle Update Label for Carts Error');
      }
    },
    [_version, checkouts, dispatch, id],
  );

  const restrictUsers = checkouts.slice(0, 6);

  const selectedCheckouts = restrictUsers.filter((checkout) => checkout.checked);
  const unSelectedCheckouts = restrictUsers.filter((checkout) => !checkout.checked);

  const checkoutContent = (checkout) => (
    <div className={classNames(styles.checkout_item, !checkout.focused ? styles.focused : null)}>
      <Icon
        color="premium"
        size="xs"
        onClick={() => toggleCartCheckouts(checkout.id)}
        name={checkout.checked ? 'edit-bordered' : 'box'}
      />
      <input
        onClick={() => !popupCart && onOpenModal()}
        className={classNames('color-input', checkout.checked ? styles.checked : null)}
        value={checkout.title}
        type="text"
      />
    </div>
  );

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
        {images.length !== 0 && <CartImages images={images} />}
        <button type="button" className={classNames(styles.icon_btn, styles.pin)}>
          <Icon
            onClick={() => onChangePin()}
            name={pined ? 'pin-black' : 'pin'}
            color="premium"
            size="xs"
          />
        </button>
        <div className={styles.cart_content}>
          {title && (
            <div
              onClick={() => !popupCart && onOpenModal()}
              className={classNames(styles.cart_title)}
            >
              <p>{title}</p>
            </div>
          )}
          {description && checkouts.length === 0 && (
            <div onClick={() => !popupCart && onOpenModal()}>
              <MainEditor
                isLarge={isLarge}
                color={color}
                initialState={description}
                editorRef={editorRef}
                readOnly
              />
            </div>
          )}
          {checkouts.length > 0 && (
            <div className={classNames(styles.checkout)}>
              {unSelectedCheckouts.map((checkout) => checkoutContent(checkout))}
              {selectedCheckouts.length > 0 && (
                <div style={{ borderTop: '1px solid #cbcbcb' }}>
                  {selectedCheckouts.map((checkout) => checkoutContent(checkout))}
                </div>
              )}
            </div>
          )}
        </div>
        <Icon name="done" color="premium" className={styles.done_icon} size="xs" />
        {labels.length !== 0 && labels !== null && (
          <div className={styles.main_chips}>
            {labels.length > 2 ? (
              <>
                <Chip onDelate={() => toggleCartLabels(labels[0])}> {labels[0]} </Chip>
                <Chip onDelate={() => toggleCartLabels(labels[1])}> {labels[1]} </Chip>
                <div className={styles.extralabel}> +{labels.length - 2} </div>
              </>
            ) : (
              labels.map((label) => (
                <Chip key={label} onDelate={() => toggleCartLabels(label)}>
                  {' '}
                  {label}{' '}
                </Chip>
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
                    <div key={user} className={inputStyles.user}>
                      {user[0].toLowerCase()}
                    </div>
                  ))}
                <div className={inputStyles.user}>{collabarators.length - 5}+</div>
              </>
            ) : (
              collabarators
                .filter((e) => e !== userEmail)
                .map((user) => (
                  <div key={user} className={inputStyles.user}>
                    {user[0].toLowerCase()}
                  </div>
                ))
            )}
          </div>
        )}
        <div className={styles.input_navbar}>
          <InputNavbar
            id={id}
            _version={_version}
            archived={archived}
            title={title}
            description={description}
            isCart
            onOpenModal={() => onOpenModal()}
            isMainInput={isMain}
            currentColor={color}
            selectedLabels={labels}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
