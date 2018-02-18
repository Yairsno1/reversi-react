import { NEW_GAME, GAME_OVER } from '../actions';
import {GAME_SCORE_NA} from '../model/game';

const resultReducer = (state=0, action) => {
  let rv = state;

  if (NEW_GAME === action.type) {
    rv = GAME_SCORE_NA;
  }
  else if (GAME_OVER === action.type) {
    rv = action.result;
  }

  return rv;
};

export default resultReducer;

