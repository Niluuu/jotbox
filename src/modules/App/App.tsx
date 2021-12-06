import { FC, useState, useCallback, useEffect, useRef } from 'react';
import {  Route,Switch } from 'react-router-dom';
import { DataStore } from '@aws-amplify/datastore';
import { useSelector, useDispatch } from 'react-redux'
import { Node } from '../../models';

import HomePage from '../HomePage/HomePage';
import SignInPage from '../SignInPage/SignInPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import ProtectedRoute from '../../component/protectedRoute/ProtectedRoute';
import ArchievePage from '../ArchievePage/ArchievePage';
import ConfirmPage from '../SignUpPage/Confirm';

interface CartProps {
  id: any;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  gaps: any[];
}

const App: FC = () => { 
  const [carts, setCart] = useState<CartProps[]>([]);
  const [isMain, setIsMain] = useState(false);
  const onSetIsMain = useCallback((bool) => setIsMain(bool), [isMain]);
  const [cartHyper, setCartHyper] = useState([]);
  const [defaultPin, setDefaultPin] = useState(false);
  const onDefaultPin = useCallback(() => {
    setDefaultPin((pre) => !pre);
  }, [defaultPin]);
  const titleRef = useRef<HTMLDivElement>();
  const textRef = useRef<HTMLDivElement>();

  async function fetchTodos() {
    try {
      const todos = await DataStore.query(Node);
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
        setCartHyper([]);
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

  return (
    <Switch>
      <ProtectedRoute
        exact
        path="/"
        component={() => (
          <HomePage
            onSetArchive={onSetArchive}
            onSetCart={onSetCart}
            defaultPin={defaultPin}
            onDefaultPin={onDefaultPin}
            onSetIsMain={onSetIsMain}
            onChangePin={onChangePin}
            onReSetCart={onReSetCart}
            onChangeArchived={onChangeArchived}
            onRemoveCart={onRemoveCart}
            carts={carts}
            cartHyper={cartHyper}
            filteredGaps={filteredGaps}
            onSetLabel={onSetLabel}
            onReSetLabel={onReSetLabel}
          />
        )}
      />

      {filteredGaps.map((filter) => (
        <ProtectedRoute
          exact
          path={`/gap/${filter}`}
          component={() => (
            <HomePage
              onSetArchive={onSetArchive}
              onSetCart={onSetCart}
              defaultPin={defaultPin}
              onDefaultPin={onDefaultPin}
              onSetIsMain={onSetIsMain}
              onChangePin={onChangePin}
              onReSetCart={onReSetCart}
              onChangeArchived={onChangeArchived}
              onRemoveCart={onRemoveCart}
              carts={carts.filter((cart) => cart.gaps.some((sub) => sub === filter))}
              cartHyper={cartHyper}
              filteredGaps={filteredGaps}
              onSetLabel={onSetLabel}
              onReSetLabel={onReSetLabel}
            />
          )}
        />
      ))}
      <Route path="*">
        <div>UNDEFINED PAGE</div>
      </Route>
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={() => <SignInPage />} />
      <Route path="/confirmCode" component={ConfirmPage} />
    </Switch>
  );
};

export default App;
