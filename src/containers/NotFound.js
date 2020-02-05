// Standard React App imports
import React from "react";

// Styling for <NotFound> and subordinate tags
import "./NotFound.css";

// Define the function component
export default function NotFound() {

// Render an error page when Routes.js cannot find a matching route for the path entered
  return (
    <div className="NotFound">
      <h3>The page you requested does not exist</h3>
    </div>
  );
}
