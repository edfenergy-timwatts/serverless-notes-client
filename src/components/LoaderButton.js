// Standard React App imports
import React from "react";

// Use React Bootstrap to provide standard UI resources and styling
import { Button, Glyphicon } from "react-bootstrap";

// Styling for <LoaderButton> and subordinate tags
import "./LoaderButton.css";

// Use cases:
//  (1) Signup.js - Signup and Verify buttons
//  (2) Login.js - Login button
//  (3) NewNote.js - Create button
//  (4) Notes.js - Save and Delete buttons
//
// Define the function component (caller passes disabled and isLoading to govern button appearance)
export default function LoaderButton({ isLoading, className = "", disabled = false, ...props }) {

// Button label styled with spinning arrow symbol (and greyed out) whilst isLoading
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
      {props.children}
    </Button>
  );
}
