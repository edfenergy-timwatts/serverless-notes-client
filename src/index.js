// Standard React App imports
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

// Use React Router to handle routing sub-page paths to specific function components
import { BrowserRouter as Router } from "react-router-dom";

// Use Amplify to map backend AWS resources, as identified in config.js
import Amplify from "aws-amplify";
import config from "./config";

// Styling for <body> and subordinate tags (rendered at "root")
import "./index.css";

// Function component called by render
import App from "./App";

// Set variables for Amplify
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "notes",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});

// Run App.js under the control of React Router to handle sub-page path requests
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

// Use register() instead for faster loading and offline operation, but with some pitfalls
serviceWorker.unregister();
