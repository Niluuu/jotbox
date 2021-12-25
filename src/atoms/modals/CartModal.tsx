import { FC, useState, useEffect, useCallback } from 'react';
import { API } from 'aws-amplify';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { closeUpdateModalIsOpen } from '../../reducers/nodes';
import styles from '../../modules/HomePage/HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import { getNode } from '../../graphql/queries';
import Cart from '../../component/cart/Cart';

interface CartModalProps {
  isTrashPage?: any;
}

const CartModal: FC<CartModalProps> = ({ isTrashPage }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [node, setNode] = useState([]);
  const dispatch = useDispatch();

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      nodesReducer: state.nodesReducer,
      grid: state.layoutGrid.grid,
    };
  });
  const { nodeID, updateModalIsOpen } = mapStateToProps.nodesReducer;

  const nodeGet = useCallback(
    async (id) => {
      try {
        const data = await API.graphql({ query: getNode, variables: { id } });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        setNode([data.data.getNode]);
        console.log('node', data);
      } catch (err) {
        console.log(err);
      }
    },
    [nodeID],
  );

  useEffect(() => {
    if (nodeID.length > 0) {
      nodeGet(nodeID);
    }
  }, [nodeID]);

  return (
    <Modal
      isLarge={!!true}
      isOpen={updateModalIsOpen}
      removeIcon={!isTrashPage && true}
      toggleModal={() => dispatch(closeUpdateModalIsOpen())}
    >
      <>
        {node[0] !== undefined && (
          <Cart
            popupCart
            id={node[0].id}
            title={node[0].title}
            description={node[0].description}
            pined={node[0].pined}
            onChangeArchived={(e) => e}
            onChangePin={(e) => e}
            onRemoveCart={(e) => e}
            onSetIsMain={(e) => e}
            onCartLabel={(e) => e}
            cartLabel="cartLabel"
            onSetLabel={(e) => e}
            filteredGaps={[]}
          />
        )}
      </>
    </Modal>
  );
};

export default CartModal;
