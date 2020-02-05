// Standard React App imports
import React from "react";

// Use React Router to handle routing sub-page paths to specific function components
import { Route, Redirect } from "react-router-dom";

// Local function to convert querystring into referred sub-page path, for use in re-direct
function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Define the function component (caller passes component, appProps and path)
export default function UnauthenticatedRoute({ component: C, appProps, ...rest }) {
  const redirect = querystring("redirect");

// Run <component>.js passing appProps (made up of isAuthenticated state)
// If not authenticated, this route is currently used to run: Signup.js and Login.js
// Otherwise re-direct to Home sub-page if no referral (ie. as a result of isAuthenticated state change in Login.js)
//        or re-direct to referred sub-page (ie. following re-direct to Login sub-page in AuthenticatedRoute.js)
  return (
    <Route {...rest} render={props =>
      !appProps.isAuthenticated
        ? <C {...props} {...appProps} />
        : <Redirect to={redirect === "" || redirect === null ? "/" : redirect} />
      }
    />
  );
}
