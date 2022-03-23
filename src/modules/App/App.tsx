/* eslint-disable max-lines */
import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../../component/protectedRoute/ProtectedRoute';
import HomePage from '../HomePage/HomePage';
import SignUpPage from '../SignUpPage/SignUpPage';
import SignInPage from '../SignInPage/SignInPage';
import ConfirmPage from '../SignUpPage/Confirm';

const App: FC = () => {
  return (
    <Switch>
      <ProtectedRoute exact path="/" component={HomePage} />
      <ProtectedRoute path="/gaps/:label" component={HomePage} />
      <ProtectedRoute exact path="/archive" component={() => <HomePage archive />} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/confirmCode" component={ConfirmPage} />
      <Route path="*" component={() => <div>Page Not Found</div>} />
    </Switch>
  );
};

export default App;
