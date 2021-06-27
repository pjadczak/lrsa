import React from 'react';
import ReactDOM from 'react-dom';
import App from './Pages/App';
import 'rsuite/dist/styles/rsuite-default.css';
import 'react-image-lightbox/style.css';

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
