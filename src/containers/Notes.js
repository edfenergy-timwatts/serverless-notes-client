// Standard React App imports, inc. React Hooks for getting/setting state and custom processing on render
import React, { useRef, useState, useEffect } from "react";

// Use React Bootstrap to provide standard UI resources and styling
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

// Use Amplify to interact with backend resources in API Gateway and S3
import { API, Storage } from "aws-amplify";

// Library plus config for handling attachments in S3 (not currently used)
//port { s3Upload } from "../libs/awsLib";
import config from "../config";

// Styling for <Notes> and subordinate tags
import "./Notes.css";

// Function component called by render
import LoaderButton from "../components/LoaderButton";

// Define the function component (caller passes isAuthenticated state, always true)
export default function Notes(props) {

// Get (extended) application state, with initial values set to a null/empty note and not isLoading/isDeleting
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

// Define state variable (managed by browser) identifying selected file, initializing file.current as null
  const file = useRef(null);

// Call custom processing on render
  useEffect(() => {

// Inline function to get a specific note via API (running notes-app-api/get.js)
    function loadNote() {
      return API.get("notes", `/notes/${props.match.params.id}`);
    }

// Inline function to obtain a given note plus attachment and store in application state
    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      }
      catch (e) {
        alert(e);
      }
    }

// Call custom function onLoad() at render whenever the selected noteId changes
    onLoad();
  }, [props.match.params.id]);

// Local function to re-format filename, removing timestamp pre-pended by awsLib.js
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

// Local function to reset selected file (from browser) in response to onChange event
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

// Local function to validate input ie. note must be non-empty
  function validateForm() {
    return content.length > 0;
  }

// Local function to update a note via API (running notes-app-api/update.js)
  function saveNote(note) {
    return API.put("notes", `/notes/${props.match.params.id}`, {
      body: note
    });
  }

// Local function to update note (inc. adding attachment) in response to onSubmit event
  async function handleSubmit(event) {
    event.preventDefault();
    let attachment;

// If a file has been selected but it is too large to attach, raise an alert
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

// Perform asynchronous calls to upload attachment (as required) and then Update API via Amplify
    try {
//    if (file.current) {
//      attachment = await s3Upload(file.current);
//    }

      await saveNote({
        content,
        attachment: attachment || note.attachment
      });

// Re-direct to Home sub-page following note update
      props.history.push("/");
    }
    catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

// Local function to delete a note via API (running notes-app-api/delete.js)
  function deleteNote() {
    return API.del("notes", `/notes/${props.match.params.id}`);
  }

// Local function to delete note (but currently not attachment) in response to onClick event
  async function handleDelete(event) {
    event.preventDefault();

// Obtain confirmation on deletion
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

// Perform asynchronous call to Delete API via Amplify
    try {
      await deleteNote();

// Re-direct to Home sub-page following note deletion
      props.history.push("/");
    }
    catch (e) {
      alert(e);
      setIsDeleting(false);
    }
  }

// Render form for displaying note plus file attachment, for potential update or deletion
// Show existing attachment or allow for one to be added
// Run LoaderButton.js to render custom Save/Delete buttons, disabled till form is valid and blocked whilst isLoading
  return (
    <div className="Notes">
      {note && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={e => setContent(e.target.value)}
            />
          </FormGroup>
          {note.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!note.attachment && <ControlLabel>Attachment</ControlLabel>}
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
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
