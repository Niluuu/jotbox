import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = localStorage.getItem("assessToken");
/* eslint-disable react/jsx-props-no-spreading */
  return (
    <Route
      {...restOfProps}
      render={(props) =>
        <Component {...props} /> 
      }
    />
  );
}

export default ProtectedRoute;
