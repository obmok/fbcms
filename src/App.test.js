import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import history from './history';
import store from './redux/store';
import {Provider} from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
