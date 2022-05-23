/* eslint-disable react/require-default-props */
import { FC } from 'react';
import { Route } from 'react-router-dom';
import SignInPage from '../../modules/SignInPage/SignInPage';

interface ProtectedRouteType {
  path: string;
  component: FC;
  exact?: boolean;
}

const ProtectedRoute: FC<ProtectedRouteType> = ({ component: Component, ...restOfProps }) => {
  const isAuthenticated = localStorage.getItem('assessToken');
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Route
      {...restOfProps}
      render={(props) => (isAuthenticated ? <Component {...props} /> : <SignInPage />)}
    />
  );
};

export default ProtectedRoute;
