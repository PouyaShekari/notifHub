import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import i18n from './i18n';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={configureStore()}>
    <React.Fragment>
      <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
    </React.Fragment>
  </Provider>
);


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => {})
        .catch(err => {});
}
