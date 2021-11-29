import { FC, useState, useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { DataStore } from '@aws-amplify/datastore';
import { Node } from '../../models';
import { Icon } from '../../component/Icon/Icon';

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
  const [isSidebarOpen, setisSidebarOpen] = useState(false);
  const toggleSider = () => setisSidebarOpen((pre) => !pre); 
  const [gridType, setGridType] = useState(false);
  const changeGrid = useCallback(() => setGridType(!gridType), [gridType]);
  const [carts, setCart] = useState<CartProps[]>([]);
  const [focused, setFocused] = useState(false);
  const [isMain, setIsMain] = useState(false);
  const onSetIsMain = useCallback((bool) => setIsMain(bool), [isMain]);
  const [hyperLinkEditMode, setHyperLinkEditMode] = useState(false);
  const [hyper, setHyper] = useState([]);
  const [cartHyper, setCartHyper] = useState([]);
  const [hyperText, setHyperText] = useState('');
  const [hyperLink, setHyperLink] = useState('');

  const [defaultPin, setDefaultPin] = useState(false);
  const onDefaultPin = useCallback(() => {
    setDefaultPin((pre) => !pre);
  }, [defaultPin]);

  const titleRef = useRef<HTMLDivElement>();
  const textRef = useRef<HTMLDivElement>();

  async function fetchTodos() {
    try {
      const todos = await DataStore.query(Node);
      console.log('models', todos);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      setCart(todos);
    } catch (err) {
      console.log(`err`, err);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const onHyperLinkEditMode = () => {
    setHyperLinkEditMode((pre) => !pre);
  };

  const onSetHyperLink = () => {
    if (isMain) setHyper([...hyper, { text: hyperText, link: hyperLink }]);
    else {
      setCartHyper([...cartHyper, { text: hyperText, link: hyperLink }]);
    }
    setHyperText('');
    setHyperLink('');
    setTimeout(() => setFocused(true), 50);
    setHyperLinkEditMode((pre) => !pre);
  };

  const onCloseModal = () => {
    setHyperLinkEditMode(false);
    setTimeout(() => {
      setHyperText('');
      setHyperLink('');
    }, 200);
  };

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
        console.log('error updating todo:', err);
      }
    },
    [carts],
  );

  const onSetLabel = useCallback(
    async (id, oldGaps: string[]) => {
      try {
        if (oldGaps.length) {
          setCart(carts.map((cart) => (cart.id === id 
            ? { ...cart, gaps: cart.gaps
                .concat(oldGaps.filter((old) => old && old))
                .filter((val, pos, arr) => arr.indexOf(val) === pos) } 
            : cart))
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
        setCart(carts.map((cart) => ({ 
          ...cart, gaps: cart.gaps.map((sub) => sub === oldValue ? newValue : sub)}
          ))
        );
        const original = await DataStore.query(Node);
        // await DataStore.save(
        //   Node.copyOf(original, (item) => {
        //     const local = item;
        //     local.gaps = item.gaps.map((sub) => sub === oldValue ? newValue : sub)
        //   })
        // );
      } catch (err) {
        console.log('error updating todo:', err);
      }
    },
    [carts]
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

  const [filterLetter, setFilterLetter] = useState('');

  const filterByLetter = async (e) => {
    setFilterLetter(e);
    try {
      const todos = await DataStore.query(Node);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      setCart(todos.filter((todo) =>
        todo.description.toLocaleLowerCase().indexOf(e.toLocaleLowerCase()) >= 0 ||
        todo.title.toLocaleLowerCase().indexOf(e.toLocaleLowerCase()) >= 0,
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const gapCategories = Array.from(carts.flatMap(({ gaps }) => gaps));
  const filteredGaps = Object.keys(
    Object.fromEntries(
      gapCategories.map((category) => [
        category,
        carts.filter((card) => card.gaps && card.gaps.includes(category)),
      ]),
    ),
  );

  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState({
    message: 'You signed in succesfully',
    icon: 'success',
  });

  const onErrorMessage = (message: string, icon: 'success' | 'error') => {
    setError({ message, icon });
    setHasError(true);
    setTimeout(() => setHasError(false), 6000);
  };

  return (
    <BrowserRouter>
      <div className={classNames('errorMessage', hasError && 'active')}>
        <div>
          {' '}
          <Icon name={error.icon} />{' '}
        </div>
        {error.message}
      </div>
      <ProtectedRoute
        exact
        path="/"
        component={() => (
          <HomePage
            setHyperText={(e) => setHyperText(e)}
            setHyperLink={(e) => setHyperLink(e)}
            hyperText={hyperText}
            hyperLink={hyperLink}
            onSetHyperLink={onSetHyperLink}
            onCloseModal={onCloseModal}
            setFocused={(e: any) => {
              setFocused(e);
            }}
            hyperLinkEditMode={hyperLinkEditMode}
            onHyperLinkEditMode={onHyperLinkEditMode}
            onSetArchive={onSetArchive}
            onSetCart={onSetCart}
            titleRef={titleRef}
            textRef={textRef}
            gridType={gridType}
            defaultPin={defaultPin}
            onDefaultPin={onDefaultPin}
            onSetIsMain={onSetIsMain}
            hyper={hyper}
            onChangePin={onChangePin}
            onReSetCart={onReSetCart}
            onChangeArchived={onChangeArchived}
            onRemoveCart={onRemoveCart}
            carts={carts}
            cartHyper={cartHyper}
            focused={focused}
            filterLetter={filterLetter}
            filterByLetter={filterByLetter}
            filteredGaps={filteredGaps}
            onSetLabel={onSetLabel}
            onReSetLabel={onReSetLabel}
            toggleSider={toggleSider}
            isSidebarOpen={isSidebarOpen}
          />
        )}
      />
      {/* <ProtectedRoute
        exact
        path="/"
        component={() => (
          <ArchievePage
            setHyperText={(e) => setHyperText(e)}
            setHyperLink={(e) => setHyperLink(e)}
            hyperText={hyperText}
            hyperLink={hyperLink}
            onSetHyperLink={onSetHyperLink}
            onCloseModal={onCloseModal}
            setFocused={(e: any) => {
              setFocused(e);
            }}
            hyperLinkEditMode={hyperLinkEditMode}
            onSetArchive={onSetArchive}
            gridType={gridType}
            onSetIsMain={onSetIsMain}
            onChangePin={onChangePin}
            onReSetCart={onReSetCart}
            onChangeArchived={onChangeArchived}
            onRemoveCart={onRemoveCart}
            carts={carts}
            focused={focused}
          />
        )}
      /> */}
      { filteredGaps.map((filter) => (
        <ProtectedRoute
          exact
          path={`/gap/${filter}`}
          component={() => (
            <HomePage
              setHyperText={(e) => setHyperText(e)}
              setHyperLink={(e) => setHyperLink(e)}
              hyperText={hyperText}
              hyperLink={hyperLink}
              onSetHyperLink={onSetHyperLink}
              onCloseModal={onCloseModal}
              setFocused={(e: any) => {
                setFocused(e);
              }}
              hyperLinkEditMode={hyperLinkEditMode}
              onHyperLinkEditMode={onHyperLinkEditMode}
              onSetArchive={onSetArchive}
              onSetCart={onSetCart}
              titleRef={titleRef}
              textRef={textRef}
              gridType={gridType}
              defaultPin={defaultPin}
              onDefaultPin={onDefaultPin}
              onSetIsMain={onSetIsMain}
              hyper={hyper}
              onChangePin={onChangePin}
              onReSetCart={onReSetCart}
              onChangeArchived={onChangeArchived}
              onRemoveCart={onRemoveCart}
              carts={carts.filter((cart) => cart.gaps.some(sub => sub === filter) )}
              cartHyper={cartHyper}
              focused={focused}
              filterLetter={filterLetter}
              filterByLetter={filterByLetter}
              filteredGaps={filteredGaps}
              toggleSider={toggleSider}
              isSidebarOpen={isSidebarOpen}
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
      <Route path="/signin" component={() => <SignInPage onErrorMessage={onErrorMessage} />} />
      <Route path="/confirmCode" component={ConfirmPage} />
    </BrowserRouter>
  );
};

export default App;
