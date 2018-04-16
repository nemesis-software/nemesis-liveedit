import React from 'react';
import ReactDOM from 'react-dom';

import App from './app/components/app';

require('es6-promise').polyfill();

ReactDOM.render(
    <App />
  , document.querySelector('.live-edit-container'));
