// Standard React App imports, inc. React Hooks for getting/setting state and custom form handling
import React, { useState } from "react";
import { useFormFields } from "../libs/hooksLib";

// Use React Bootstrap to provide standard UI resources and styling
import { FormGroup, FormControl, ControlLabel, HelpBlock } from "react-bootstrap";

// Use Amplify to interact with backend resources in Cognito
import { Auth } from "aws-amplify";

// Styling for <ChangeEmail> and subordinate tags
import "./ChangeEmail.css";

// Function component called by render
import LoaderButton from "../components/LoaderButton";

// Define the function component (caller passes isAuthenticated state, always false)
export default function ChangeEmail(props) {

// Get (extended) application state, with initial values set to empty form fields and false for all flags
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    code: "",
    email: ""
  });

// Local function to validate request ie. email must be non-empty
  function validateEmailForm() {
    return fields.email.length > 0;
  }

// Local function to validate confirmation ie. code must be non-empty
  function validateConfirmForm() {
    return fields.code.length > 0;
  }

// Local function to request change of email in response to onSubmit event
  async function handleUpdateClick(event) {
    event.preventDefault();
    setIsSendingCode(true);

// Perform asynchronous calls to Cognito (obtain user, then change password) via Amplify
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, { email: fields.email });

      setCodeSent(true);
    }
    catch (e) {
      alert(e.message);
      setIsSendingCode(false);
    }
  };

// Local function to confirm change of email in response to onSubmit event
  async function handleConfirmClick(event) {
    event.preventDefault();
    setIsConfirming(true);

// Perform asynchronous call to Cognito (for user attribute change) via Amplify
    try {
      await Auth.verifyCurrentUserAttributeSubmit("email", fields.code);

// Return to Settings.js on completion
      props.history.push("/settings");
    }
    catch (e) {
      alert(e.message);
      setIsConfirming(false);
    }
  };

// Local function to render form for capturing new email
// Run LoaderButton.js to render custom Update Email button, disabled till form is valid and blocked whilst isLoading
  function renderUpdateForm() {
    return (
      <form onSubmit={handleUpdateClick}>
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
          disabled={!validateEmailForm()}
          isLoading={isSendingCode}
        >
     { /* loadingText="Updating…" */ }
     { /* text="Update Email"     */ }
          Update Email
        </LoaderButton>
      </form>
    );
  }

// Local function to render form for capturing confirmation code
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
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          disabled={!validateConfirmForm()}
          isLoading={isConfirming}
        >
     { /* loadingText="Confirm…" */ }
     { /* text="Confirm"         */ }
          Confirm
        </LoaderButton>
      </form>
    );
  }

// Change Email sub-page differs based on codeSent state; either update or confirmation form
  return (
    <div className="ChangeEmail">
      {!codeSent
        ? renderUpdateForm()
        : renderConfirmationForm()}
    </div>
  );
}
