// Standard React App import
import React from "react";

// Use React Router to handle routing sub-page paths to specific function components
import { LinkContainer } from "react-router-bootstrap";

// Styling for <Settings> and subordinate tags
import "./Settings.css";

// Function component called by render
import LoaderButton from "../components/LoaderButton";

// Define the function component (caller passes isAuthenticated state, always true)
export default function Settings(props) {

// Render Settings sub-page with buttons linking to email/password sub-pages
  return (
    <div className="Settings">
      <LinkContainer to="/settings/email">
        <LoaderButton
          block
          bsSize="large"
        >
          Change Email
        </LoaderButton>
      </LinkContainer>
      <LinkContainer to="/settings/password">
        <LoaderButton
          block
          bsSize="large"
        >
          Change Password
        </LoaderButton>
      </LinkContainer>
    </div>
  );
}
