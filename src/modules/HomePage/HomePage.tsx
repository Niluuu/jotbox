import { FC, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { API, graphqlOperation } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { Node } from '../../models';
import { listNodes } from '../../graphql/queries';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from '../../atoms/cart-layout/CartLayout';
import Layout from '../../atoms/layout/Layout';
import { RootState } from '../../app/store';
import AddLinkModal from '../../atoms/modals/AddLinkModal';
import gapFilter from '../../utils/hooks/gapFilter';
import { createNode, deleteNode, updateNode } from '../../graphql/mutations';
import CartModal from '../../atoms/modals/CartModal';
import { setText } from '../../reducers/editor';
import { initialStateStr } from '../../utils/editor/initialState';
import { onUpdateNode } from '../../graphql/subscriptions';

interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  gaps: string[];
  _version: number;
  color: string;
}

interface HomePageProps {
  gapsFilterKey?: string;
}

const HomePage: FC<HomePageProps> = ({ gapsFilterKey }) => {
  const [nodes, setNodes] = useState<CartProps[]>([]);
  const [focused, setFocused] = useState(false);
  const [defaultPin, setDefaultPin] = useState(false);
  const [defaultColor, setDefaultColor] = useState('default');
  const titleRef = useRef<HTMLDivElement>();
  const userEmail = localStorage.getItem('userEmail');
  const [filter] = useState({
    collabarator: {
      eq: 'saidumarovanilufar@mail.ru',
    },
  });

  const onDefaultColor = useCallback((optionalColor) => {
    setDefaultColor(optionalColor);
  }, [defaultColor])

  const dispatch = useDispatch();

  const cleanUp = useCallback(() => {
    titleRef.current.innerHTML = '';
    setDefaultPin(false);
    dispatch(setText(initialStateStr));
  }, []);

  const onDefaultPin = useCallback(() => {
    setDefaultPin((pre) => !pre);
  }, []);

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      grid: state.layoutGrid.grid,
      text: state.editorReducer.text,
    };
  });

  const { grid, text } = mapStateToProps;

  async function getAllNodes() {
    try {
      const data = await API.graphql({ query: listNodes, variables: { filter } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = data.data.listNodes;
      // eslint-disable-next-line no-console
      console.log('getAllNodes', items);
      setNodes(items);
    } catch (err) {
      throw new Error('Get Nodes Error');
    }
  }

  useEffect(() => {
    getAllNodes();
  }, []);

  const onColorChange = useCallback(
    async (id, color, _version) => {
      try {
        const updatedNode = { 
          id, color, _version
        };
  
        await API.graphql({
          query: updateNode,
          variables: { input: updatedNode }
        });
      } catch (err) {
      console.log('error changing color', err);
    }      
  }, [nodes]) 

  const onRemoveCart = useCallback(async (id, _version) => {
    try {
      await API.graphql({ query: deleteNode, variables: { input: { id, _version } } });
    } catch (err) {
      throw new Error('Remove node error');
    }
  }, []);

  const onChangePin = useCallback(async (id, pined, _version) => {
    try {
      const updatedNode = {
        id,
        pined,
        _version,
      };

      await API.graphql({
        query: updateNode,
        variables: { input: updatedNode },
      });
    } catch (err) {
      throw new Error('Update node error');
    }
  }, []);

  const onChangeArchived = useCallback(async (id, title, description) => {
    try {
      //  TODO: Add update function
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onSetLabel = useCallback(async (id, oldGaps: string[]) => {
    try {
      // if (oldGaps.length) {
      //   setNodes(
      //     nodes.map((cart) =>
      //       cart.id === id
      //         ? {
      //             ...cart,
      //             gaps: cart.gaps
      //               .concat(oldGaps.filter((old) => old && old))
      //               .filter((val, pos, arr) => arr.indexOf(val) === pos),
      //           }
      //         : cart,
      //     ),
      //   );
      //   const original = await DataStore.query(Node, id);
      //   await DataStore.save(
      //     Node.copyOf(original, (item) => {
      //       const cart = item;
      //       cart.gaps = item.gaps
      //         .concat(oldGaps.filter((old) => old && old))
      //         .filter((val, pos, arr) => arr.indexOf(val) === pos);
      //     }),
      //   );
      // }
    } catch (err) {
      console.log('error updating todo:', err);
    }
  }, []);

  const onReSetLabel = useCallback(
    async (oldValue, newValue) => {
      try {
        setNodes(
          nodes.map((cart) => ({
            ...cart,
            gaps: cart.gaps.map((sub) => (sub === oldValue ? newValue : sub))
          }))
        );
      } catch (err) {
        console.log('error updating labels:', err);
      }
    },
    [nodes],
  );

  const onSetNodes = useCallback(async () => {
    try {
      const node = {
        title: titleRef.current.innerText,
        description: text,
        gaps: [],
        pined: defaultPin,
        archived: false,
        trashed: false,
        collabarator: userEmail,
      };

      await API.graphql({ query: createNode, variables: { input: node } });
      cleanUp();
    } catch (err) {
      throw new Error('Create node error');
    }
  }, [cleanUp, defaultPin, text, userEmail]);

  const onSetArchive = useCallback(async () => {
    try {
      setDefaultPin(false);
      setDefaultColor('default');

      await DataStore.save(
        new Node({
          pined: defaultPin,
          archived: true,
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }, [nodes]);

  const filteredGaps = gapFilter(nodes);

  const nodesToProps = gapsFilterKey
    ? nodes.filter((cart) => cart.gaps.includes(gapsFilterKey))
    : nodes;

  const onFilterSearch = useCallback(
    async (value) => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        // setNodes(
        //   carts.filter((cart) => cart.title.toLowerCase().indexOf(value.toLowerCase()) >= 0),
        // );
      } catch (err) {
        console.log('error filtering by letters', err);
      }
    },
    [nodes],
  );

  useEffect(() => {
    getAllNodes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRemoveCart, onChangePin, onColorChange]);

  return (
    <Layout onFilterSearch={onFilterSearch} filteredGaps={filteredGaps} onReSetLabel={onReSetLabel}>
      <div className={classNames(styles.home_page, grid && styles.column)}>
        <div className={styles.home_page__main_input}>
          <MainInput
            focused={focused}
            setFocused={setFocused}
            onSetArchive={onSetArchive}
            onSetNodes={onSetNodes}
            defaultPin={defaultPin}
            onDefaultPin={onDefaultPin}
            titleRef={titleRef}
            defaultColor={defaultColor}
            onDefaultColor={onDefaultColor}
          />
        </div>
        <CartLayout
          onChangePin={onChangePin}
          onChangeArchived={onChangeArchived}
          onRemoveCart={onRemoveCart}
          gridType={grid}
          carts={nodes}
          onSetLabel={onSetLabel}
          filteredGaps={filteredGaps}
          onColorChange={onColorChange}
        />
        <AddLinkModal />
        <CartModal />
      </div>
    </Layout>
  );
};

export default HomePage;
