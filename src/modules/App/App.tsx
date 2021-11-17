import { FC, useState, useCallback, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { DataStore } from '@aws-amplify/datastore';
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
  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  const toggleSider = useCallback(() => setisSidebarOpen(!isSidebarOpen), [isSidebarOpen]);
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
      console.log('models', todos); // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      setCart(todos);
    } catch (err) {
      console.log(`err`, err);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const onHyperLinkEditMode = useCallback(() => {
    setHyperLinkEditMode(true);
  }, []);

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

  const onCloseModal = useCallback(() => {
    setHyperText('');
    setHyperLink('');
    setHyperLinkEditMode(false);
  }, [hyperLinkEditMode]);

  const onRemoveCart = useCallback(
    async (id) => {
      try {
        setCart(carts.filter((cart) => cart.id !== id));
        // await API.graphql(graphqlOperation(deleteTodo, { input: { id } }));
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
        // await API.graphql(
        //   graphqlOperation(updateTodo, {
        //     input: { id, title, description, pined: !carts.find((cart) => cart.id === id).pined },
        //   }),
        // );
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
        // await API.graphql(
        //   graphqlOperation(updateTodo, {
        //     input: { id, title, description, archived: true, pined: false },
        //   }),
        // );
      } catch (err) {
        console.log(err);
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
          gaps: null,
        };
        setCart([...carts, cart]);

        setDefaultPin(false);
        titleRef.current.innerHTML = '';
        textRef.current.innerHTML = '';

        // await API.graphql(graphqlOperation(createTodo, { input: cart }));
      } catch (err) {
        console.log(err);
      }
  }, [carts, defaultPin]);

  const onReSetCart = useCallback(
    async (id, title, description) => {
      try {
        setCart(carts.map((cart) => (cart.id === id ? { ...cart, title, description } : cart)));
        setCartHyper([]);
        // await API.graphql(graphqlOperation(updateTodo, { input: { id, title, description } }));
      } catch (err) {
        console.log('error updating todo:', err);
      }
    },
    [carts],
  );

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
      titleRef.current.innerHTML = '';
      textRef.current.innerHTML = '';

      // await API.graphql(graphqlOperation(createTodo, { input: cart }));
    } catch (err) {
      console.log(err);
    }
  }, [carts]);

  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={HomePage}
          setHyperText={(e) => setHyperText(e)}
          setHyperLink={(e) => setHyperLink(e)}
          hyperText={hyperText}
          hyperLink={hyperLink}
          onSetHyperLink={onSetHyperLink}
          onCloseModal={onCloseModal}
          setFocused={(e) => setFocused(e)}
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
        />
        <ProtectedRoute
          path="/archives"
          component={ArchievePage}
          setHyperText={(e) => setHyperText(e)}
          setHyperLink={(e) => setHyperLink(e)}
          hyperText={hyperText}
          hyperLink={hyperLink}
          onSetHyperLink={onSetHyperLink}
          onCloseModal={onCloseModal}
          setFocused={(e) => setFocused(e)}
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
        <Route path="/signUp" component={SignUpPage} />
        <Route path="/signIn" component={SignInPage} />
        <Route path="/confirmCode" component={ConfirmPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
