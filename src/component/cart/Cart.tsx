/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { FC, useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { API, Storage } from 'aws-amplify';
import { useDispatch, useSelector } from 'react-redux';
import { Chip } from '../chip/Chip';
import { Icon } from '../Icon/Icon';
import styles from './Cart.module.scss';
import inputStyles from '../input/MainInput.module.scss';
import { InputNavbar } from '../input/InputNavbar';
import MainEditor from '../../modules/Editor/MainEditor';
import './Color.scss';
import { updateNode } from '../../graphql/mutations';
import { setNodesToProps, updateNodesToProps } from '../../reducers/nodes';
import { RootState } from '../../app/store';
import { getNode } from '../../graphql/queries';

interface CartProps {
  /**
   * Node Id
   */
  id: string;
  /**
   * Node version of node
   */
  _version?: number;
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
   * Node archived or not?
   */
  archived: boolean;
  /**
   * Node color
   */
  color: string;
  /**
   * Layout type for cart size
   */
  gridType: boolean;
  /**
   * ?
   */
  popupCart?: boolean;
  /**
   * Collobarators of the Node Cart
   */
  collabarators: string[];
  onOpenModal: () => void;
  img: string[];
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
  } = props;
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      nodes: state.nodesReducer.nodes,
    };
  });

  const { nodes } = mapStateToProps;

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

  const onChangePin = useCallback(
    async (nodeId: string, nodePined: boolean, nodeVersion: number): Promise<CartProps> => {
      try {
        const updatedNode = {
          id: nodeId,
          pined: nodePined,
          archived: false,
          _version: nodeVersion,
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
    },
    [dispatch],
  );

  const toggleCartLabels = useCallback(
    async (nodeId: string, nodeVersion: number, nodeLabels: string): Promise<CartProps> => {
      try {
        const data = await API.graphql({ query: getNode, variables: { nodeId } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const cart = data.data.getNode;
        const cartlabels = cart.labels;

        const updatedlabels = cartlabels.includes(nodeLabels)
          ? cartlabels.filter((cartlabel: string) => cartlabel !== nodeLabels)
          : [...cartlabels, nodeLabels];

        const updatedNode = { id: nodeId, _version: nodeVersion, labels: updatedlabels };

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
    [dispatch],
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
        {images.length !== 0 && images.map((image) => <img key={image} src={image} />)}
        <button type="button" className={classNames(styles.icon_btn, styles.pin)}>
          <Icon
            onClick={() => onChangePin(id, !pined, _version)}
            name={pined ? 'pin-black' : 'pin'}
            color="premium"
            size="xs"
          />
        </button>
        <div onClick={() => !popupCart && onOpenModal()} className={styles.cart_content}>
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
                <Chip key={label} onDelate={() => toggleCartLabels(id, _version, label)}>
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
