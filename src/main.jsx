// Import necessary dependencies
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.js";

// Create a root for React to render into, using the element with id "root"
ReactDOM.createRoot(document.getElementById("root")).render(
  // Wrap the app in React.StrictMode to highlight potential problems
  <React.StrictMode>
    {/* Wrap the entire app with Redux Provider */}
    {/* This makes the Redux store available to all components in the app */}
    <Provider store={store}>
      {/* Render the main App component */}
      <App />
    </Provider>
  </React.StrictMode>,
);
