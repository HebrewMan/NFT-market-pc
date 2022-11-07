import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {initI18n}  from "./utils/i18n"
// window.React = React;
// if (module && module.hot) {
//   module.hot.accept();
// }
initI18n()

ReactDOM.render(<App />, document.querySelector('#root'));
