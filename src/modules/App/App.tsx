import { FC, useState, useCallback, useEffect, useRef } from 'react';
import { Switch, Route, useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { listTodos } from '../../graphql/queries';
import { Header } from '../Header/Header';
import { Sider } from '../Sider/Sider';
import HomePage from '../HomePage/HomePage';
import ArchievePage from '../ArchievePage/ArchievePage';
import TrashPage from '../TrashPage/TrashPage';
import SignInPage from '../SignInPage/SignInPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import GapsFilter from '../GapsFilterPage/GapsFilter';
import { createTodo, deleteTodo, updateTodo } from '../../graphql/mutations';

interface CartProps {
  id: any;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  gaps: any[]
}

const App: FC = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isSidebarOpen, setisSidebarOpen] = useState(true);

  const toggleSider = useCallback(() => setisSidebarOpen(!isSidebarOpen), [isSidebarOpen]);

  const [gridType, setGridType] = useState(false);
  const changeGrid = useCallback(() => setGridType(!gridType), [gridType]);

  const [carts, setCart] = useState<CartProps[]>([
    { title: "1", id: "1", description: "gap", pined: false, archived: false, gaps: ["science", "english"] },
    { title: "2", id: "2", description: "gap", pined: false, archived: false, gaps: ["english"] },
    { title: "3", id: "3", description: "gap", pined: false, archived: false, gaps: ["science", "education"] },
    { title: "4", id: "4", description: "gap", pined: false, archived: false, gaps: ["education", "english"] },
  ]);

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
      const todoData = await API.graphql(graphqlOperation(listTodos));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const todos = todoData.data.listTodos.items;
      console.log('dasda', todoData);
      // setCart(todos);
    } catch (err) {
      console.log(`err`, err);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [carts]);

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
        await API.graphql(graphqlOperation(deleteTodo, { input: { id } }));
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
        await API.graphql(
          graphqlOperation(updateTodo, {
            input: { id, title, description, pined: !carts.find((cart) => cart.id === id).pined },
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
        await API.graphql(
          graphqlOperation(updateTodo, {
            input: { id, title, description, archived: true, pined: false },
          }),
        );
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

      await API.graphql(graphqlOperation(createTodo, { input: cart }));
    } catch (err) {
      console.log(err);
    }
  }, [carts, defaultPin]);

  const onReSetCart = useCallback(
    async (id, title, description) => {
      try {
        setCart(carts.map((cart) => (cart.id === id ? { ...cart, title, description } : cart)));
        setCartHyper([]);
        await API.graphql(graphqlOperation(updateTodo, { input: { id, title, description } }));
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

      await API.graphql(graphqlOperation(createTodo, { input: cart }));
    } catch (err) {
      console.log(err);
    }
  }, [carts]);
  
  const gap = Array.from(carts.flatMap(({ gaps }) => gaps))
  const filtered = Object.keys(Object.fromEntries(gap.map((group) => [group])))

  return (
    <>
        <div>
          <Header
            isLoggedIn={isLoggedIn}
            gridType={gridType}
            onClick={toggleSider}
            changeGrid={changeGrid}
          />
          <section className="layout">
            <Sider filtered={filtered} isSidebarOpen={isSidebarOpen} onClick={toggleSider} />
            <Switch>
              <Route exact path="/">
                <HomePage 
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
                  focused={focused} />
              </Route>
              <Route path="/reminders">
                <div>remninders</div>
              </Route>

              { filtered.map((filter) => 
                <Route path={`/gaps/${filter}`}> 
                  <GapsFilter 
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
                    filter={filter}
                  /> 
                </Route>) }

              <Route path="/archives">
                <ArchievePage
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
              </Route>
              <Route path="/trash">
                <TrashPage gridType={gridType} />
              </Route>
              

              <Route path="/gap/:id">
                <Gap />
              </Route>

              <Route path="*">
                <div>UNDEFINED PAGE</div>
              </Route>
            </Switch>
          </section>
        </div>
      ) : (
        <div>
          <Switch>
            <Route exact path="/signUp">
              <SignUpPage />
            </Route>
            <Route exact path="/signIn">
              <SignInPage />
            </Route>

            <Route path="*">
              <div>UNDEFINED PAGE</div>
            </Route>
          </Switch>
        </div>
      {/* {isLoggedIn ? (
        <div>
          <Header
            isLoggedIn={isLoggedIn}
            gridType={gridType}
            onClick={toggleSider}
            changeGrid={changeGrid}
          />
          <section className="layout">
            <Sider isSidebarOpen={isSidebarOpen} onClick={toggleSider} />
            <Switch>
              <Route exact path="/">
                <HomePage gridType={gridType} />
              </Route>
              <Route path="/reminders">
                <div>remninders</div>
              </Route>
              <Route path="/archives">
                <ArchievePage gridType={gridType} />
              </Route>
              <Route path="/trash">
                <TrashPage gridType={gridType} />
              </Route>

              <Route path="/gap/:id">
                <Gap />
              </Route>

              <Route path="*">
                <div>UNDEFINED PAGE</div>
              </Route>
            </Switch>
          </section>
        </div>
      ) : (
        <div>
          <Switch>
            <Route exact path="/signUp">
              <SignUpPage />
            </Route>
            <Route exact path="/signIn">
              <SignInPage />
            </Route>

            <Route path="*">
              <div>UNDEFINED PAGE</div>
            </Route>
          </Switch>
        </div>
      )} */}
    </>
  );
};

function Gap() {
  const { id } = useParams();

  return (
    <div>
      GAPAS
      <h3>ID: {id}</h3>
    </div>
  );
}

export default App;
