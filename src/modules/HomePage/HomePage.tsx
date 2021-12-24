import { FC, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { DataStore } from '@aws-amplify/datastore';
import { API, graphqlOperation } from 'aws-amplify';
import { Node } from '../../models';
import { listNodes } from '../../graphql/queries';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from '../../component/cart-layout/CartLayout';
import Layout from '../../atoms/layout/Layout';
import { RootState } from '../../app/store';
import AddLinkModal from '../../atoms/modals/AddLinkModal';
import { getNodes } from '../../api/nodes';
import gapFilter from '../../utils/hooks/gapFilter';

interface CartProps {
  id: any;
  title: string;
  description: any;
  pined: boolean;
  archived: boolean;
  gaps: any[];
}

interface HomePageProps {
  gapsFilterKey?: any;
}

const HomePage: FC<HomePageProps> = ({ gapsFilterKey }) => {
  const [nodes, setNodes] = useState<CartProps[]>([]);
  const [focused, setFocused] = useState(false);
  const [isMain, setIsMain] = useState(false);
  const onSetIsMain = useCallback((bool) => setIsMain(bool), [isMain]);
  const [defaultPin, setDefaultPin] = useState(false);
  const titleRef = useRef<HTMLDivElement>();
  const colabarator = localStorage.getItem("userEmail");
  const [filter, setFilter] = useState({ })

  const onDefaultPin = useCallback(() => {
    setDefaultPin((pre) => !pre);
  }, [defaultPin]);

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      grid: state.layoutGrid.grid,
      text: state.editorReducer.text,
    };
  });

  const { grid, text } = mapStateToProps;

  async function getAllNodes() {
    try {
      const arr = await API.graphql({ query: listNodes});
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      setNodes(arr.data.listNodes.items);
      console.log("object", arr)
    } catch (err) {
      console.log("err", err)
    }
  }

  useEffect(() => {
    getAllNodes();
  }, []);

  const onRemoveCart = useCallback(
    async (id) => {
      try {
        setNodes(nodes.filter((cart) => cart.id !== id));
        const modelToDelete = await DataStore.query(Node, id);
        DataStore.delete(modelToDelete);
      } catch (err) {
        console.log(err);
      }
    },
    [nodes],
  );

  const onChangePin = useCallback(
    async (id, title, description) => {
      try {
        setNodes(
          nodes.map((cart) =>
            cart.id === id ? { ...cart, title, description, pined: !cart.pined } : cart,
          ),
        );

        //  TODO: fix mutation
        const original = await DataStore.query(Node, id);
        await DataStore.save(
          Node.copyOf(original, (item) => {
            const cart = item;
            cart.pined = !item.pined;
          }),
        );
      } catch (err) {
        console.log(err);
      }
    },
    [nodes],
  );

  const onChangeArchived = useCallback(
    async (id, title, description) => {
      try {
        setNodes(
          nodes.map((cart) =>
            cart.id === id ? { ...cart, title, description, archived: true, pined: false } : cart,
          ),
        );
        const original = await DataStore.query(Node, id);
        //  TODO: fix mutation, change naming original is not describe anything

        await DataStore.save(
          Node.copyOf(original, (item) => {
            const cart = item;
            cart.archived = true;
            cart.pined = false;
            cart.description = description;
            cart.title = title;
          }),
        );
      } catch (err) {
        console.log(err);
      }
    },
    [nodes],
  );

  const onResetNodes = useCallback(
    async (id, title, description) => {
      try {
        setNodes(nodes.map((cart) => (cart.id === id ? { ...cart, title, description } : cart)));
        const original = await DataStore.query(Node, id);
        await DataStore.save(
          Node.copyOf(original, (item) => {
            const cart = item;
            cart.description = description;
            cart.title = title;
          }),
        );
      } catch (err) {
        //  TODO: Add your meseage for all console error
        console.log('error updating todo:', err);
      }
    },
    [nodes],
  );

  const onSetLabel = useCallback(
    async (id, oldGaps: string[]) => {
      try {
        if (oldGaps.length) {
          setNodes(
            nodes.map((cart) =>
              cart.id === id
                ? {
                    ...cart,
                    gaps: cart.gaps
                      .concat(oldGaps.filter((old) => old && old))
                      .filter((val, pos, arr) => arr.indexOf(val) === pos),
                  }
                : cart,
            ),
          );
          const original = await DataStore.query(Node, id);
          await DataStore.save(
            Node.copyOf(original, (item) => {
              const cart = item;
              cart.gaps = item.gaps
                .concat(oldGaps.filter((old) => old && old))
                .filter((val, pos, arr) => arr.indexOf(val) === pos);
            }),
          );
        }
      } catch (err) {
        console.log('error updating todo:', err);
      }
    },
    [nodes],
  );

  const onReSetLabel = useCallback(
    async (oldValue, newValue) => {
      try {
        setNodes(
          nodes.map((cart) => ({
            ...cart,
            gaps: cart.gaps.map((sub) => (sub === oldValue ? newValue : sub)),
          })),
        );
        const original = await DataStore.query(Node);
      } catch (err) {
        console.log('error updating todo:', err);
      }
    },
    [nodes],
  );

  const onSetNodes = useCallback(async () => {
    try {
      const node = {
        id: Date.now(),
        title: titleRef.current.innerText,
        description: text,
        gaps: [],
        pined: defaultPin,
        archived: false,
        trashed: false,
      }

      setNodes([node, ...nodes])
      setDefaultPin(false);
      await DataStore.save(new Node(node),
);

      titleRef.current.innerHTML = '';
    } catch (err) {
      console.log(err);
    }
  }, [defaultPin]);

  const onSetArchive = useCallback(async () => {
    try {
      setDefaultPin(false);

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
        const todos = await getNodes();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        setNodes(todos.filter((cart) => cart.title.toLowerCase().indexOf(value.toLowerCase()) >= 0));
      } catch (err) {
        console.log(err);
      }
    },
    [nodes],
  );

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
            onSetIsMain={onSetIsMain}
            titleRef={titleRef}
          />
        </div>
        <CartLayout
          onChangePin={onChangePin}
          onResetNodes={onResetNodes}
          onChangeArchived={onChangeArchived}
          onRemoveCart={onRemoveCart}
          gridType={grid}
          carts={nodesToProps}
          onSetLabel={onSetLabel}
          filteredGaps={filteredGaps}
        />
        <AddLinkModal />
      </div>
    </Layout>
  );
};

export default HomePage;
