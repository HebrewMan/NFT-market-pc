import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { initI18n } from './utils/i18n'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from 'Src/store'
// window.React = React;
// if (module && module.hot) {
//   module.hot.accept();
// }
initI18n()

ReactDOM.render(
  <>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </>,
  document.querySelector('#root'),
)
