import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
/* eslint-disable react/jsx-props-no-spreading */
  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? 
        <Component {...props} /> : <Redirect to="/signIn" />
      }
    />
  );
}

export default ProtectedRoute;
