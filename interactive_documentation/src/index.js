/**
 * @file Entry point for the React application. It imports necessary modules and CSS,
 * then mounts the main App component onto the root DOM element.
 * 
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import React from 'react'; // Importing React to build components.
import ReactDOM from 'react-dom/client'; // Importing ReactDOM for DOM-specific methods.
import './css/Index.css'; // Importing base CSS for the application.
import App from './pages/App'; // Importing the main App component.

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);