import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { apollo } from './apollo';
import { store } from './app/store';
import App from './modules/App/App';
import './styles/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apollo}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
