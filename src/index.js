import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import ReversiApp from './ReversiApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ReversiApp />, document.getElementById('root'));
registerServiceWorker();
