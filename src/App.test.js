import React from 'react';
import ReactDOM from 'react-dom';
import ReversiApp from './ReversiApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ReversiApp />, div);
});
