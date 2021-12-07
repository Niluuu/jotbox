import { FC, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { DataStore } from '@aws-amplify/datastore';
import { Node } from '../../models';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from '../../component/cart-layout/CartLayout';
import Layout from '../../atoms/layout/Layout';
import { RootState } from '../../app/store';
import AddLinkModal from '../../atoms/modals/AddLinkModal';
import { getNodes } from '../../api/nodes';

interface CartProps {
  id: any;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  gaps: any[];
}

const HomePage: FC = () => {
  const [focused, setFocused] = useState(false);
  const [isMain, setIsMain] = useState(false);
  const onSetIsMain = useCallback((bool) => setIsMain(bool), [isMain]);
  const [carts, setCart] = useState<CartProps[]>([]);
  const [defaultPin, setDefaultPin] = useState(false);
  const onDefaultPin = useCallback(() => {
    setDefaultPin((pre) => !pre);
  }, [defaultPin]);
  const titleRef = useRef<HTMLDivElement>();
  const textRef = useRef<HTMLDivElement>();

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
    if (titleRef.current.innerText && textRef.current.innerHTML)
      try {
        const cart = {
          id: Date.now(),
          title: titleRef.current.innerText,
          description: textRef.current.innerHTML,
          pined: defaultPin,
          archived: false,
          gaps: [],
        };
        setCart([...carts, cart]);
        setDefaultPin(false);

        await DataStore.save(
          new Node({
            title: titleRef.current.innerText,
            description: textRef.current.innerHTML,
            gaps: [],
            pined: defaultPin,
            archived: false,
          }),
        );
        titleRef.current.innerHTML = '';
        textRef.current.innerHTML = '';
      } catch (err) {
        console.log(err);
      }
  }, [carts, defaultPin]);

  const onSetArchive = useCallback(async () => {
    try {
      const cart = {
        id: Date.now(),
        title: titleRef.current.innerText,
        description: textRef.current.innerHTML,
        pined: false,
        archived: true,
        gaps: null,
      };
      setCart([...carts, cart]);
      setDefaultPin(false);

      await DataStore.save(
        new Node({
          title: titleRef.current.innerText,
          description: textRef.current.innerHTML,
          gaps: [],
          pined: defaultPin,
          archived: true,
        }),
      );
      titleRef.current.innerHTML = '';
      textRef.current.innerHTML = '';
    } catch (err) {
      console.log(err);
    }
  }, [carts]);

  // Todo: I added to new folder export form make it work! and delete this lines of code
  const gapCategories = Array.from(carts.flatMap(({ gaps }) => gaps));
  const filteredGaps = Object.keys(
    Object.fromEntries(
      gapCategories.map((category) => [
        category,
        carts.filter((card) => card.gaps && card.gaps.includes(category)),
      ]),
    ),
  );

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      layoutReducer: state.layoutGridTypeReducer,
    };
  });

  const dispatch = useDispatch();

  const { grid } = mapStateToProps.layoutReducer;

  return (
    <Layout filteredGaps={filteredGaps} onReSetLabel={onReSetLabel}>
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
          />
        </div>
        <CartLayout
          onChangePin={onChangePin}
          onReSetCart={onReSetCart}
          onChangeArchived={onChangeArchived}
          onRemoveCart={onRemoveCart}
          gridType={grid}
          carts={carts}
          onSetLabel={onSetLabel}
          filteredGaps={filteredGaps}
        />
        <AddLinkModal />
      </div>
    </Layout>
  );
};

export default HomePage;
