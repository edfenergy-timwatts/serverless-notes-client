// Standard React App imports, inc. React Hooks for getting/setting state (same for browser-managed components)
import React, { useState, useRef } from "react";

// Use React Bootstrap to provide standard UI resources and styling
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

// Use Amplify to interact with backend resources in API Gateway
import { API } from "aws-amplify";

// Library plus config for handling attachments in S3 (not currently used)
//port { s3Upload } from "../libs/awsLib";
import config from "../config";

// Styling for <NewNote> and subordinate tags
import "./NewNote.css";

// Function component called by render
import LoaderButton from "../components/LoaderButton";

// Define the function component (caller passes isAuthenticated state, always true)
export default function NewNote(props) {

// Get (extended) application state, with initial values set to an empty note and not isLoading
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

// Define state variable (managed by browser) identifying selected file, initializing file.current as null
  const file = useRef(null);

// Local function to reset selected file (from browser) in response to onChange event
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

// Local function to validate input ie. note must be non-empty
  function validateForm() {
    return content.length > 0;
  }

// Local function to create note (inc. attachment) in response to onSubmit event
  async function handleSubmit(event) {
    event.preventDefault();

// If a file has been selected but it is too large to attach, raise an alert
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

// Perform asynchronous calls to upload attachment (as required) and then Create API via Amplify
    try {
//    const attachment = file.current
//      ? await s3Upload(file.current)
//      : null;
//    await createNote({ content, attachment });
      await createNote({ content });

// Re-direct to Home sub-page following note creation
      props.history.push("/");
    }
    catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

// Local function to create a note via API (running notes-app-api/create.js)
  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note
    });
  }

// Render form for capturing note plus file attachment
// Run LoaderButton.js to render custom Create button, disabled till form is valid and blocked whilst isLoading
  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <FormControl
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}
