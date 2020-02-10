// Standard React App imports, inc. React Hooks for getting/setting state and custom form handling
import React, { useState } from "react";
import { useFormFields } from "../libs/hooksLib";

// Use React Bootstrap to provide standard UI resources and styling
import { FormGroup, FormControl, ControlLabel, HelpBlock, Glyphicon } from "react-bootstrap";

// Use React Router to handle routing sub-page paths to specific function components
import { Link } from "react-router-dom";

// Use Amplify to interact with backend resources in Cognito
import { Auth } from "aws-amplify";

// Styling for <ResetPassword> and subordinate tags
import "./ResetPassword.css";

// Function component called by render
import LoaderButton from "../components/LoaderButton";

// Define the function component (caller passes isAuthenticated state, always false)
export default function ResetPassword(props) {

// Get (extended) application state, with initial values set to empty form fields and false for all flags
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    code: "",
    password: "",
    confirmPassword: ""
  });

// Local function to validate reset request ie. email must be non-empty
  function validateCodeForm() {
    return fields.email.length > 0;
  }

// Local function to validate reset completion ie. code/password must be non-empty and password confirmation is matching
  function validateResetForm() {
    return (
      fields.code.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

// Local function to generate reset code in response to onSubmit event
  async function handleSendCodeClick(event) {
    event.preventDefault();
    setIsSendingCode(true);

// Perform asynchronous call to Cognito (for reset request) via Amplify
    try {
      await Auth.forgotPassword(fields.email);
      setCodeSent(true);
    }
    catch (e) {
      alert(e.message);
      setIsSendingCode(false);
    }
  };

// Local function to perform reset in response to onSubmit event
  async function handleConfirmClick(event) {
    event.preventDefault();
    setIsConfirming(true);

// Perform asynchronous call to Cognito (for reset completion) via Amplify
    try {
      await Auth.forgotPasswordSubmit(fields.email, fields.code, fields.password);
      setConfirmed(true);
    }
    catch (e) {
      alert(e.message);
      setIsConfirming(false);
    }
  };

// Local function to render form for capturing login to be reset
// Run LoaderButton.js to render custom Send Confirmation button, disabled till form is valid and blocked whilst isLoading
  function renderRequestCodeForm() {
    return (
      <form onSubmit={handleSendCodeClick}>
        <FormGroup bsSize="large" controlId="email">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isSendingCode}
          disabled={!validateCodeForm()}
        >
     { /* loadingText="Sending…"   */ }
     { /* text="Send Confirmation" */ }
          Send Confirmation
        </LoaderButton>
      </form>
    );
  }

// Local function to render form for capturing reset code and new password
// Run LoaderButton.js to render custom Confirm button, disabled till form is valid and blocked whilst isLoading
  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmClick}>
        <FormGroup bsSize="large" controlId="code">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={fields.code}
            onChange={handleFieldChange}
          />
          <HelpBlock>
            Please check your email ({fields.email}) for the confirmation
            code.
          </HelpBlock>
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
          isLoading={isConfirming}
          disabled={!validateResetForm()}
        >
     { /* loadingText="Confirm…" */ }
     { /* text="Confirm"         */ }
          Confirm
        </LoaderButton>
      </form>
    );
  }

// Local function to render confirmation page with link to Login
  function renderSuccessMessage() {
    return (
      <div className="success">
        <Glyphicon glyph="ok" />
        <p>Your password has been reset.</p>
        <p>
          <Link to="/login">
            Click here to login with your new credentials.
          </Link>
        </p>
      </div>
    );
  }

// Reset sub-page differs based on codeSent/confirmed state; either reset request/completion form or link to login
  return (
    <div className="ResetPassword">
      {!codeSent
        ? renderRequestCodeForm()
        : !confirmed
          ? renderConfirmationForm()
          : renderSuccessMessage()}
    </div>
  );
}
