import { FC, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { API, graphqlOperation } from 'aws-amplify';
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
import { createNode, deleteNode, updateNode } from '../../graphql/mutations';

interface CartProps {
  id: any;
  title: string;
  description: any;
  pined: boolean;
  archived: boolean;
  gaps: any[];
  trashed: boolean;
  color: string;
}

interface HomePageProps {
  gapsFilterKey?: any;
}

const initialState = JSON.stringify({
  blocks: [
    {
      key: 'cbbnn',
      text: 'sad thing',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
});

const HomePage: FC<HomePageProps> = ({ gapsFilterKey }) => {
  const [carts, setCart] = useState<CartProps[]>([]);
  const [cartDescription, setCartDescription] = useState('');
  const [focused, setFocused] = useState(false);
  const [isMain, setIsMain] = useState(false);
  const onSetIsMain = useCallback((bool) => setIsMain(bool), [isMain]);

  const [defaultPin, setDefaultPin] = useState(false);
  const onDefaultPin = useCallback(() => {
    setDefaultPin((pre) => !pre);
  }, [defaultPin]);

  const [defaultColor, setDefaultColor] = useState('default');
  const onDefaultColor = useCallback((optionalColor) => {
    setDefaultColor(optionalColor);
  }, [defaultColor]);

  const titleRef = useRef<HTMLDivElement>();

  async function fetchTodos() {
    try {
      const todos = await getNodes();
      const fakeRequest = [
        {
          id: '1',
          title: 'First',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'default'
        },
        {
          id: '2',
          title: 'Second',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'red'
        },
        {
          id: '3',
          title: 'Third',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'orange'
        },
        {
          id: '4',
          title: 'Fourth',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'yellow'
        },
        {
          id: '5',
          title: 'Fifth',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'green'
        },
        {
          id: '6',
          title: 'Six',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'light-blue'
        },
        {
          id: '7',
          title: 'Seven',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'blue'
        },
        {
          id: '8',
          title: 'Eight',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'bold-blue'
        },
        {
          id: '9',
          title: 'Nine',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'purple'
        },
        {
          id: '10',
          title: 'Ten',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'pink'
        },
        {
          id: '11',
          title: 'Eleven',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'brown'
        },
        {
          id: '12',
          title: 'Twelve',
          description: JSON.stringify(initialState),
          pined: false,
          archived: false,
          trashed: false,
          gaps: [],
          color: 'grey'
        },
      ];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      setCart(fakeRequest);
    } catch (err) {
      console.log(`error fetching todos`, err);
    }
  }

  useEffect(() => {
    fetchTodos();
    console.log('initialState', typeof initialState);
  }, []);

  const onRemoveCart = useCallback(
    async (id) => {
      try {
        setCart(carts.filter((cart) => cart.id !== id));

        await API.graphql(graphqlOperation(deleteNode, { input: { id } })); 
      } catch (err) {
        console.log('error removing todos', err);
      }
    },
    [carts]
  );

  const onChangePin = useCallback(
    async (id, title, description) => {
      try {
        setCart(carts.map((cart) =>
          cart.id === id ? { ...cart, title, description, pined: !cart.pined } : cart
          )
        );

        const currentCart = carts.find((item) => item.id === id) 

        await API.graphql(graphqlOperation(updateNode, { input: { id, pined: !currentCart.pined } })); 
      } catch (err) {
        console.log('error changing pinned attr', err);
      }
    },
    [carts],
  );

  const onChangeArchived = useCallback(
    async (id, title, description) => {
      try {
        setCart(carts.map((cart) => cart.id === id ? 
          { ...cart, title, description, archived: true, pined: false } : cart)
        );
        
        await API.graphql(graphqlOperation(updateNode, 
          { input: { id, archived: true, pined: false, title, description } 
        })); 
      } catch (err) {
          console.log('error changing archived attr', err);
        }
      },
    [carts],
  );

  const onSetCart = useCallback(async () => {
    try {
      const cart = {
        id: Date.now(),
        title: titleRef.current.innerText,
        description: JSON.stringify(initialState),
        pined: defaultPin,
        archived: false,
        trashed: false,
        gaps: [],
        color: defaultColor
      };
      setCart([cart, ...carts]);
      setDefaultPin(false);
      setDefaultColor('default');
      
      await API.graphql(graphqlOperation(createNode, { input: cart })); 

      titleRef.current.innerHTML = '';
    } catch (err) {
      console.log('errror creating todo', err);
    }
  }, [carts, defaultPin, defaultColor]);

  const onReSetCart = useCallback(
    async (id, title, description) => {
      try {
        setCart(carts.map((cart) => (cart.id === id ? { ...cart, title, description } : cart)));

        await API.graphql(graphqlOperation(updateNode, { input: { id, title, description } })); 
      } catch (err) {
        console.log('error updating todo', err);
      }
    },
    [carts],
  );

  const onSetLabel = useCallback(
    async (id, oldGaps: string[]) => {
      try {
        if (oldGaps.length) {
          setCart(carts.map((cart) => cart.id === id
            ? { ...cart, gaps: cart.gaps
                .concat(oldGaps.filter((old) => old && old))
                .filter((val, pos, arr) => arr.indexOf(val) === pos) }
            : cart
            )
          );
              
          await API.graphql(graphqlOperation(updateNode, { input: { id, gaps: id.gaps
            .concat(oldGaps.filter((old) => old && old))
            .filter((val, pos, arr) => arr.indexOf(val) === pos) } 
          })); 
        }
      } catch (err) {
        console.log('error creating label', err);
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
            gaps: cart.gaps.map((sub) => (sub === oldValue ? newValue : sub))
          }))
        );
      } catch (err) {
        console.log('error updating labels:', err);
      }
    },
    [carts],
  );

  const onSetArchive = useCallback(async () => {
    try {
      const cart = {
        id: Date.now(),
        title: titleRef.current.innerText,
        description: cartDescription,
        pined: false,
        trashed: false,
        archived: true,
        gaps: null,
        color: 'default'
      };
      setCart([...carts, cart]);
      setDefaultPin(false);

      await API.graphql(graphqlOperation(createNode, { input: cart }));

      titleRef.current.innerHTML = '';
    } catch (err) {
      console.log(err);
    }
  }, [carts]);

  const filteredGaps = gapFilter(carts);

  const cartsToProps = gapsFilterKey
    ? carts.filter((cart) => cart.gaps.includes(gapsFilterKey))
    : carts;

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      layoutReducer: state.layoutGridTypeReducer,
    };
  });

  const onFilterSearch = useCallback(
    async (value) => {
      try {
        const todos = await getNodes();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        setCart(todos.filter((cart) => cart.title.toLowerCase().indexOf(value.toLowerCase()) >= 0));
      } catch (err) {
        console.log('error filtering by letters', err);
      }
  }, [carts]);
    
  const onColorChange = useCallback(
    async (id, color) => {
      try {
        setCart(carts.map((cart) => cart.id === id ? { ...cart, color } : cart));

        await API.graphql(graphqlOperation(updateNode, { input: { id, color } })); 
      } catch (err) {
      console.log('error changing color', err);
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
            defaultColor={defaultColor}
            onDefaultColor={onDefaultColor}
            setCartDescription={() => setCartDescription}
          />
        </div>
        <CartLayout
          onColorChange={onColorChange}
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
