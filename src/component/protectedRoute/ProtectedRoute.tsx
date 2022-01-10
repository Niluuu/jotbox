import { Redirect, Route } from 'react-router-dom';
import SignInPage from '../../modules/SignInPage/SignInPage';

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = localStorage.getItem('assessToken');
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Route
      {...restOfProps}
      render={(props) => (isAuthenticated ? <Component {...props} /> : <SignInPage />)}
    />
  );
}

export default ProtectedRoute;
