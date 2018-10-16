//Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

//My app styles
import './css/style.css';

//React & redux stuff
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import { Router } from 'react-router-dom';
import history from './modules/history';

//Main app component
import App from './components/app';

const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore);


ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
  , document.querySelector('.app-container'));

