import React from "react";
import { Redirect } from "react-router-dom";

const RouteRedirect = (Component, props) => {
  const AuthRoute = (props) => {
    //check if the user has a jwt token
    const isAuth = sessionStorage.getItem("secret_token");
    //if he has no secret token, display the requested component (i.e. register user)
    if (!isAuth) {
      return <Component {...props} />;
    }
    //if not, redirect to the homepage
    else {
      return <Redirect to="/" {...props} />;
    }
  };
  return AuthRoute;
};
export default RouteRedirect;
