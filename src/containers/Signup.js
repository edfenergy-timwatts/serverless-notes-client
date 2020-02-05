// Standard React App imports, inc. React Hooks for getting/setting state and custom form handling
import React, { useState } from "react";
import { useFormFields } from "../libs/hooksLib";

// Use React Bootstrap to provide standard UI resources and styling
import { FormGroup, FormControl, ControlLabel, HelpBlock } from "react-bootstrap";

// Use Amplify to interact with backend resources in Cognito
import { Auth } from "aws-amplify";

// Styling for <Login> and subordinate tags
import "./Signup.css";

// Function component called by render
import LoaderButton from "../components/LoaderButton";

// Define the function component (caller passes isAuthenticated state, always false)
export default function Signup(props) {

// Get (extended) application state, with initial values set to empty user/form fields and not isLoading
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: ""
  });

// Local function to validate sign-up ie. email/password must be non-empty and password confirmation is matching
  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

// Local function to validate confirmation ie. code must be non-empty
  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

// Local function to perform user sign-up in response to onSubmit event
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

// Perform asynchronous call to Cognito (for sign-up) via Amplify
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password
      });
      setNewUser(newUser);
      setIsLoading(false);
    }
    catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

// Local function to perform user confirmation in response to onSubmit event
  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

// Perform asynchronous calls to Cognito (for confirmation and login) via Amplify
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

// Set isAuthenticated state to true
      props.userHasAuthenticated(true);

// Consequently UnauthenticatedRoute.js (as caller) re-directs to Home.js following successful sign-up
// So is the following actually necessary (removed in Login.js)?
      props.history.push("/");
    }
    catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

// Local function to render form for capturing sign-up confirmation to be verified
// Run LoaderButton.js to render custom Verify button, disabled till form is valid and blocked whilst isLoading
  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={fields.confirmationCode}
            onChange={handleFieldChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </form>
    );
  }

// Local function to render form for capturing sign-up details to be confirmed
// Run LoaderButton.js to render custom Signup button, disabled till form is valid and blocked whilst isLoading
  function renderForm() {
    return (
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
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.confirmPassword}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </form>
    );
  }

// Sign-up sub-page differs based on newUser state; either sign-up or confirmation form
  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
