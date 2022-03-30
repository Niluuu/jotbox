/* eslint-disable max-lines */
import { FC } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import SignUpPage from '../SignUpPage/SignUpPage';
import SignInPage from '../SignInPage/SignInPage';
import ConfirmPage from '../SignUpPage/Confirm';

const App: FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/notes" />
      </Route>
      <Route path="/notes" component={HomePage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/confirmCode" component={ConfirmPage} />
      <Route path="*" component={() => <div>Page Not Found</div>} />
    </Switch>
  );
};

export default App;
