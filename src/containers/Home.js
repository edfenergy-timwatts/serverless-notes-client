// Standard React App imports, inc. React Hooks for getting/setting state and custom processing on render
import React, { useState, useEffect } from "react";

// Use React Bootstrap to provide standard UI resources and styling
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";

// Use React Router to handle routing sub-page paths to specific function components
import { LinkContainer } from "react-router-bootstrap";

// Use Amplify to interact with backend resources in API Gateway
import { API } from "aws-amplify";

// Styling for <Home> and subordinate tags
import "./Home.css";

// Define the function component (caller passes isAuthenticated state)
export default function Home(props) {

// Get (extended) application state, with initial values set to an empty array of notes and isLoading
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

// Call custom processing on render
  useEffect(() => {

// Inline function to obtain array of notes (if authenticated) and reset application state accordingly
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } 
      catch (e) {
        alert(e);
      }

      setIsLoading(false);
    }

// Call custom function onLoad() at render whenever isAuthenticated state changes
    onLoad();
  }, [props.isAuthenticated]);

// Local function to get a list of notes via API (running notes-app-api/list.js)
  function loadNotes() {
    return API.get("notes", "/notes");
  }

// Local function to build hyperlinked list of notes using result set from List API (stored in state variable)
// Empty first item (forced) has link routing to sub-page path for NewNote.js (allowing note capture)
// Subsequent items have link routing to sub-page path for Notes.js, inc. noteId in path (for call to Get API)
  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          { /* Show first line of note plus creation date */ }
          <ListGroupItem header={note.content.trim().split("\n")[0]}>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              { /* Show fullwidth plus sign symbol with text prompting note capture */ }
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

// Local function to render list of notes once state has been reset following asynchronous call to List API via Amplify
  function renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!isLoading && renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }

// Local function to render splash page
  function renderLander() {
    return (
      <div className="lander">
        <h1>Memo</h1>
        <p>A primitive aide memoire</p>
      </div>
    );
  }

// Home sub-page differs based on isAuthenticated state; either list of notes or splash page
  return (
    <div className="Home">
      {props.isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
