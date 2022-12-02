import { legacy_createStore as createStore } from 'redux';
import { actionReducer } from './reducers';

const store = createStore(actionReducer);
export default store;
