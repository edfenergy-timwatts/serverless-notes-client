// Standard React App imports
import React from "react";

// Use React Router to handle routing sub-page paths to specific function components
import { Route, Redirect } from "react-router-dom";

// Define the function component (caller passes component, appProps and path)
export default function AuthenticatedRoute({ component: C, appProps, ...rest }) {

// Run <component>.js passing appProps (made up of isAuthenticated state)
// If authenticated, this route is currently used to run: NewNote.js and Notes.js
// Otherwise, re-direct to Login sub-page (with referral to the requested sub-page on completion)
  return (
    <Route {...rest} render={props =>
      appProps.isAuthenticated
        ? <C {...props} {...appProps} />
        : <Redirect to={`/login?redirect=${props.location.pathname}${props.location.search}`} />
      }
    />
  );
}
