import {NEW_GAME,
  GAME_OVER,
  GAME_CANCELED,
  GAME_PAUSED_RESUMED} from '../actions';
import * as APP_CONST from '../appConst';

const uiStateReducer = (state=0, action) => {
  let rv = state;

  if (NEW_GAME === action.type) {
    rv = APP_CONST.getUINextState(state, APP_CONST.UI_OP_PLAY);
  } else if (GAME_OVER === action.type) {
    rv = APP_CONST.getUINextState(state, APP_CONST.UI_OP_ENDED);
  } else if (GAME_CANCELED === action.type) {
    rv = APP_CONST.getUINextState(state, APP_CONST.UI_OP_CANCEL);
  } else if (GAME_PAUSED_RESUMED === action.type) {
    rv = APP_CONST.getUINextState(state, action.op);
  }

  return rv;
};

export default uiStateReducer;
