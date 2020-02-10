// Standard React App imports, inc. React Hooks for getting/setting state and custom form handling
import React, { useState } from "react";
import { useFormFields } from "../libs/hooksLib";

// Use React Bootstrap to provide standard UI resources and styling
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

// Use React Router to handle routing sub-page paths to specific function components
import { Link } from "react-router-dom";

// Use Amplify to interact with backend resources in Cognito
import { Auth } from "aws-amplify";

// Styling for <Login> and subordinate tags
import "./Login.css";

// Function component called by render
import LoaderButton from "../components/LoaderButton";

// Define the function component (caller passes isAuthenticated state, always false)
export default function Login(props) {

// Get (extended) application state, with initial values set to empty form fields and not isLoading
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

// Local function to validate input ie. email/password must be non-empty
  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

// Local function to perform user authentication in response to onSubmit event
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

// Perform asynchronous call to Cognito via Amplify
    try {
      await Auth.signIn(fields.email, fields.password);

// Set isAuthenticated state to true
      props.userHasAuthenticated(true);

// Consequently UnauthenticatedRoute.js (as caller) re-directs to Home.js following successful login
//    props.history.push("/");
    }
    catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

// Render form for capturing login details for authentication
// Run LoaderButton.js to render custom Login button, disabled till form is valid and blocked whilst isLoading
  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <Link to="/login/reset">Forgot password?</Link>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  );
}
