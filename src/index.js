import Game, * as GAME_CONST from './model/game';
import * as APP_CONST from './appConst';
import {PLAYER_LIGHT} from './model/position';
import { createStore } from 'redux'
import rootReducer from './reducers/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import ReversiApp from './ReversiApp';
import registerServiceWorker from './registerServiceWorker';

const game = new Game();
game.start();
    //We store the viewed position separate from the game because it
    //has one of two sources, the active game or from post-game replay.
const pos = game.currentPosition.clone(); //Copy of the position, view-only.

const intialState = {
  game: game,
  position: {position: pos, currMove: ''},
  uiState: APP_CONST.UI_STATE_GAME_TO_START,
  opponentKind: APP_CONST.OPPONENT_KIND_ENGINE,
  myColor: PLAYER_LIGHT,
  showNewGameForm: false,
  blinkWinnerMessage: {active: false, visible: false, winner: GAME_CONST.GAME_SCORE_NA},
};

let store = createStore(rootReducer,
  intialState,
  composeWithDevTools(
  // other store enhancers if any
));

ReactDOM.render(
  <Provider store={store}>
    <ReversiApp store={store}/>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
