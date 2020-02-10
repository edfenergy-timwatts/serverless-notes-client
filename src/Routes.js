// Standard React App imports
import React from "react";

// Use React Router to handle routing sub-page paths to specific function components
import { Route, Switch } from "react-router-dom";

// Function components called by render
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

// Function components called for a route
import Home from "./containers/Home";
import Login from "./containers/Login";
import ResetPassword from "./containers/ResetPassword";
import Signup from "./containers/Signup";
import Settings from "./containers/Settings";
import ChangeEmail from "./containers/ChangeEmail";
import ChangePassword from "./containers/ChangePassword";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import NotFound from "./containers/NotFound";

// Define the function component (caller passes isAuthenticated state)
export default function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Home} appProps={appProps} />
      <UnauthenticatedRoute path="/login" exact component={Login} appProps={appProps} />
      <UnauthenticatedRoute path="/login/reset" exact component={ResetPassword} appProps={appProps} />
      <UnauthenticatedRoute path="/signup" exact component={Signup} appProps={appProps} />
      <AuthenticatedRoute path="/settings" exact component={Settings} appProps={appProps} />
      <AuthenticatedRoute path="/settings/email" exact component={ChangeEmail} appProps={appProps} />
      <AuthenticatedRoute path="/settings/password" exact component={ChangePassword} appProps={appProps} />
      { /* Explicit route before pattern-matching route */ }
      <AuthenticatedRoute path="/notes/new" exact component={NewNote} appProps={appProps} />
      <AuthenticatedRoute path="/notes/:id" exact component={Notes} appProps={appProps} />
      { /* Finally, catch all unmatched routes */ }
      <Route component={NotFound} />
    </Switch>
  );
}
