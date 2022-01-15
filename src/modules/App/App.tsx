import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import SignInPage from '../SignInPage/SignInPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import ProtectedRoute from '../../component/protectedRoute/ProtectedRoute';
import ConfirmPage from '../SignUpPage/Confirm';

const App: FC = () => {
  return (
    <Switch>
      <ProtectedRoute exact path="/" component={HomePage} />
      <ProtectedRoute exact path="/archive" component={() => <HomePage archive />} />
      <ProtectedRoute path="/gaps/:label" component={HomePage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/confirmCode" component={ConfirmPage} />
      <Route path="*" component={<div>UNDEFINED PAGE</div>} />
    </Switch>
  );
};

export default App;
