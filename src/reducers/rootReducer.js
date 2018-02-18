import { combineReducers } from 'redux';
import positionReducer from './positionReducer';
import uiStateReducer from './uiStateReducer';
import opponentKindReducer from './opponentKindReducer';
import myColorReducer from './myColorReducer';
import newGameFormReducer from './newGameFormReducer';
import blinkWinnerMessageReducer from './blinkWinnerMessageReducer';
import resultReducer from './resultReducer';
import movesReducer from './movesReducer';

const rootReducer = combineReducers({
  myColor: myColorReducer,
  opponentKind: opponentKindReducer,
  position: positionReducer,
  result: resultReducer,
  moves: movesReducer,
  uiState: uiStateReducer,
  showNewGameForm: newGameFormReducer,
  blinkWinnerMessage: blinkWinnerMessageReducer,
});

export default rootReducer;
