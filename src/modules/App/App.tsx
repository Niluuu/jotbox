import { FC, useState, useCallback } from 'react';
import { Switch, Route, useParams } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Sider } from '../Sider/Sider';
import HomePage from '../HomePage/HomePage';
import ArchievePage from '../ArchievePage/ArchievePage';
import TrashPage from '../TrashPage/TrashPage';
import SignInPage from '../SignInPage/SignInPage';
import SignUpPage from '../SignUpPage/SignUpPage';

const App: FC = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isSidebarOpen, setisSidebarOpen] = useState(true);

  const toggleSider = useCallback(() => setisSidebarOpen(!isSidebarOpen), [isSidebarOpen]);

  const [gridType, setGridType] = useState(false);
  const changeGrid = useCallback(() => setGridType(!gridType), [gridType]);

  return (
    <>
      {isLoggedIn ? (
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
      )}
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
