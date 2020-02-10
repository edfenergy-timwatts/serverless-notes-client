// Standard React App imports, inc. React Hooks for getting/setting state and custom form handling
import React, { useState } from "react";
import { useFormFields } from "../libs/hooksLib";

// Use React Bootstrap to provide standard UI resources and styling
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

// Use Amplify to interact with backend resources in Cognito
import { Auth } from "aws-amplify";

// Styling for <ChangePassword> and subordinate tags
import "./ChangePassword.css";

// Function component called by render
import LoaderButton from "../components/LoaderButton";

// Define the function component (caller passes isAuthenticated state, always false)
export default function ChangePassword(props) {

// Get (extended) application state, with initial values set to empty form fields and false for all flags
  const [isChanging, setIsChanging] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    oldPassword: "",
    password: "",
    confirmPassword: ""
  });

// Local function to validate reset completion ie. old/new passwords must be non-empty and password confirmation is matching
  function validateForm() {
    return (
      fields.oldPassword.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

// Local function to perform reset in response to onSubmit event
  async function handleChangeClick(event) {
    event.preventDefault();
    setIsChanging(true);

// Perform asynchronous calls to Cognito (obtain user, then change password) via Amplify
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(currentUser, fields.oldPassword, fields.password);

// Return to Settings.js on completion
      props.history.push("/settings");
    }
    catch (e) {
      alert(e.message);
      setIsChanging(false);
    }
  };

// Render form for capturing old/new passwords
// Run LoaderButton.js to render custom Change Password button, disabled till form is valid and blocked whilst isLoading
  return (
    <div className="ChangePassword">
      <form onSubmit={handleChangeClick}>
        <FormGroup bsSize="large" controlId="oldPassword">
          <ControlLabel>Old Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.oldPassword}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <hr />
        <FormGroup bsSize="large" controlId="password">
          <ControlLabel>New Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="confirmPassword">
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
          disabled={!validateForm()}
          isLoading={isChanging}
        >
     { /* loadingText="Changing…" */ }
     { /* text="Change Password"  */ }
          Change Password
        </LoaderButton>
      </form>
    </div>
  );
}
