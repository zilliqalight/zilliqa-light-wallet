import { combineReducers, createStore } from 'redux';
import reducers from '../reducers/index';

const index = createStore(
  combineReducers({
    ...reducers,
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default index;
