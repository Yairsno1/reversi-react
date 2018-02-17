import { combineReducers } from 'redux';
import newGameReducer from './newGameReducer';
import positionReducer from './positionReducer';
import uiStateReducer from './uiStateReducer';
import opponentKindReducer from './opponentKindReducer';
import myColorReducer from './myColorReducer';
import newGameFormReducer from './newGameFormReducer';
import blinkWinnerMessageReducer from './blinkWinnerMessageReducer';

const rootReducer = combineReducers({
  game: newGameReducer,
  position: positionReducer,
  uiState: uiStateReducer,
  showNewGameForm: newGameFormReducer,
  opponentKind: opponentKindReducer,
  myColor: myColorReducer,
  blinkWinnerMessage: blinkWinnerMessageReducer,
});

export default rootReducer;
