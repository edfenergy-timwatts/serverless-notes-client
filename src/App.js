// Standard React App imports, inc. React Hooks for getting/setting state and custom processing on render
import React, { useState, useEffect } from "react";

// Use React Bootstrap to provide standard UI resources and styling
import { Nav, Navbar, NavItem } from "react-bootstrap";

// Use React Router to handle routing sub-page paths to specific function components
import { Link, withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

// Use Amplify to maintain login session state
import { Auth } from "aws-amplify";

// Styling for <App> and subordinate tags
import "./App.css";

// Function component called by render
import Routes from "./Routes";

// Define the top-level React App function component (with parameters provided by React Router)
function App(props) {

// Get application state, with initial values set to isAuthenticating and not isAuthenticated
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

// Call custom function onLoad() at first render only (due to [])
  useEffect(() => {
    onLoad();
  }, []);

// Local function to obtain login information persisted by Amplify and reset application state accordingly
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

// Local function to clear login information persisted by Amplify and reset application state accordingly
  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);

// Re-direct to Login sub-page following Logout
    props.history.push("/login");
  }

// Delay rendering until application state has been reset following asynchronous call to Amplify
// Show Signup/Login menu items, or Logout if authenticated
// Run Routes.js passing isAuthenticated application state (isAuthenticating is always false)
  return (
    !isAuthenticating &&
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Memo</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {isAuthenticated
              ? <>
                  <LinkContainer to="/settings">
                    <NavItem>Settings</NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}>Logout</NavItem>
                </>
              : <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
    </div>
  );
}

// Use withRouter component to wrap App in order to gain access to path history (for re-direct on Logout)
export default withRouter(App);
