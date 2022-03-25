/* eslint-disable max-lines */
import { FC, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../../component/protectedRoute/ProtectedRoute';
import HomePage from '../HomePage/HomePage';
import SignUpPage from '../SignUpPage/SignUpPage';
import SignInPage from '../SignInPage/SignInPage';
import ConfirmPage from '../SignUpPage/Confirm';
import Layout from '../../atoms/layout/Layout';

const App: FC = () => {
  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  const toggleSider = () => setisSidebarOpen((pre) => !pre);

  return (
    <Switch>
      <Layout toggleSider={toggleSider} isSidebarOpen={isSidebarOpen}>
        <ProtectedRoute
          exact
          path="/"
          component={() => <HomePage isSidebarOpen={isSidebarOpen} />}
        />
        <ProtectedRoute
          path="/gaps/:label"
          component={() => <HomePage isSidebarOpen={isSidebarOpen} />}
        />
        <ProtectedRoute
          exact
          path="/archive"
          component={() => <HomePage archive isSidebarOpen={isSidebarOpen} />}
        />
      </Layout>
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/confirmCode" component={ConfirmPage} />
      <Route path="*" component={() => <div>Page Not Found</div>} />
    </Switch>
  );
};

export default App;
