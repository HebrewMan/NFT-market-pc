import { legacy_createStore as createStore, combineReducers, Store, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { applyMiddleware } from 'redux';
import storage from 'redux-persist/lib/storage';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';
import global from './modules/global/reducer';
import load from './modules/load/reducers';

// 拆分的reducer合并
const reducer = combineReducers({
  global,
  load,
});

// 持久化配置
const persistConfig = {
  key: 'redux-state',
  storage: storage,
};
const persistReducerConfig = persistReducer(persistConfig, reducer);

// 开启 redux-devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 使用 redux 中间件
const middleWares = applyMiddleware(reduxThunk, reduxPromise);

const store: Store = createStore(persistReducerConfig, composeEnhancers(middleWares));

// 创建持久化 store
const persistor = persistStore(store);

export { store, persistor };
