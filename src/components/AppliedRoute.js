// Standard React App imports
import React from "react";

// Use React Router to handle routing sub-page paths to specific function components
import { Route } from "react-router-dom";

// Define the function component (caller passes component, appProps and path)
export default function AppliedRoute({ component: C, appProps, ...rest }) {

// Run <component>.js passing appProps (made up of isAuthenticated state)
// This route is currently used to run: Home.js
  return (
    <Route {...rest} render={props => <C {...props} {...appProps} />} />
  );
}
