import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import './index.css';
import App from './App';
import configureStore from './store';
import { csrfFetch, restoreCSRF } from './store/csrf';
import * as sessionActions from "./store/session"

// https://meetup-8d0b.onrender.com

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF()

  window.csrfFetch = csrfFetch
  window.store = store;
  window.sessionActions = sessionActions
}

function Root() {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
