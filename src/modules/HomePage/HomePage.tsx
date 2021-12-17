import { FC, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { DataStore } from '@aws-amplify/datastore';
import { Node, Gaps } from '../../models';
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
  gapsFilterKey?: any
}


const initialState = JSON.stringify({
  blocks: [
    {
      key: "cbbnn",
      text: "sdasdasda",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ],
  entityMap: {}
})

const HomePage: FC<HomePageProps> = ({ gapsFilterKey }) => {
  const [carts, setCart] = useState<CartProps[]>([]);
  const [focused, setFocused] = useState(false);
  const [isMain, setIsMain] = useState(false);
  const onSetIsMain = useCallback((bool) => setIsMain(bool), [isMain]);
  const [defaultPin, setDefaultPin] = useState(false);
  const onDefaultPin = useCallback(() => {
    setDefaultPin((pre) => !pre);
  }, [defaultPin]);
  const titleRef = useRef<HTMLDivElement>();

  async function fetchTodos() {
    try {
      const todos = await getNodes();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      setCart(todos);
    } catch (err) {
      //  TODO: Add your meseage for all console error
      console.log(`err`, err);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const onRemoveCart = useCallback(
    async (id) => {
      try {
        setCart(carts.filter((cart) => cart.id !== id));
        const modelToDelete = await DataStore.query(Node, id);
        DataStore.delete(modelToDelete);
      } catch (err) {
        console.log(err);
      }
    },
    [carts],
  );

  const onChangePin = useCallback(
    async (id, title, description) => {
      try {
        setCart(
          carts.map((cart) =>
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
    [carts],
  );

  const onChangeArchived = useCallback(
    async (id, title, description) => {
      try {
        setCart(
          carts.map((cart) =>
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
    [carts],
  );

  const onReSetCart = useCallback(
    async (id, title, description) => {
      try {
        setCart(carts.map((cart) => (cart.id === id ? { ...cart, title, description } : cart)));
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
    [carts],
  );

  const onSetLabel = useCallback(
    async (id, oldGaps: string[]) => {
      try {
        if (oldGaps.length) {
          setCart(
            carts.map((cart) =>
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
    [carts],
  );

  const onReSetLabel = useCallback(
    async (oldValue, newValue) => {
      try {
        setCart(
          carts.map((cart) => ({
            ...cart,
            gaps: cart.gaps.map((sub) => (sub === oldValue ? newValue : sub)),
          })),
        );
        const original = await DataStore.query(Node);
      } catch (err) {
        console.log('error updating todo:', err);
      }
    },
    [carts],
  );

  const onSetCart = useCallback(async () => {
      try {
        const cart = {
          id: Date.now(),
          title:  titleRef.current.innerText,
          description: initialState,
          pined: defaultPin,
          archived: false,
          gaps: [],
        };
        setCart([...carts, cart]);
        setDefaultPin(false);

        await DataStore.save(
          new Node({
            title: titleRef.current.innerText ,
            description: initialState,
            gaps: [],
            pined: defaultPin,
            archived: false,
            trashed: false
          }),
        );

        titleRef.current.innerHTML = '';
      } catch (err) {
        console.log(err);
      }
  }, [carts, defaultPin]);

  const onSetArchive = useCallback(async () => {
    try {
      const cart = {
        id: Date.now(),
        title: titleRef.current.innerText,
        description: JSON.stringify(initialState),
        pined: false,
        archived: true,
        gaps: null,
      };
      setCart([...carts, cart]);
      setDefaultPin(false);

      await DataStore.save(
        new Node({
          title: titleRef.current.innerText,
          description: JSON.stringify(initialState),
          gaps: [],
          pined: defaultPin,
          archived: true,
          trashed: false
        }),
      );
      
      titleRef.current.innerHTML = '';
    } catch (err) {
      console.log(err);
    }
  }, [carts]);
  
  const filteredGaps = gapFilter(carts)
  
  const cartsToProps = gapsFilterKey 
    ? carts.filter((cart) => cart.gaps.includes(gapsFilterKey)) : carts
  
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      layoutReducer: state.layoutGridTypeReducer,
    };
  });
  
  const onFilterSearch = useCallback(async (value) => {
    try {
      const todos = await getNodes();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      setCart(todos.filter((cart) => 
        cart.title.toLowerCase().indexOf(value.toLowerCase()) >= 0
      ))
    } catch(err) {
      console.log(err);
    }   
  }, [carts])


  const { grid } = mapStateToProps.layoutReducer;

  return (
    <Layout onFilterSearch={onFilterSearch} filteredGaps={filteredGaps} onReSetLabel={onReSetLabel}>
      <div className={classNames(styles.home_page, grid && styles.column)}>
        <div className={styles.home_page__main_input}>
          <MainInput
            focused={focused}
            setFocused={setFocused}
            onSetArchive={onSetArchive}
            onSetCart={onSetCart}
            defaultPin={defaultPin}
            onDefaultPin={onDefaultPin}
            onSetIsMain={onSetIsMain}
            titleRef={titleRef}
          />
        </div>
        <CartLayout
          onChangePin={onChangePin}
          onReSetCart={onReSetCart}
          onChangeArchived={onChangeArchived}
          onRemoveCart={onRemoveCart}
          gridType={grid}
          carts={cartsToProps}
          onSetLabel={onSetLabel}
          filteredGaps={filteredGaps}
        />
        <AddLinkModal />
      </div>
    </Layout>
  );
};

export default HomePage;
