/* eslint-disable max-lines */
import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import SignUpPage from '../SignUpPage/SignUpPage';
import SignInPage from '../SignInPage/SignInPage';
import ConfirmPage from '../SignUpPage/Confirm';
import ProtectedRoute from '../../component/protectedRoute/ProtectedRoute';

const App: FC = () => {
  return (
    <Switch>
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/confirmCode" component={ConfirmPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="*" component={() => <div>Page Not Found</div>} />
    </Switch>
  );
};

export default App;
