import {NEW_GAME, GAME_OVER, WINNER_MESSAGE} from '../actions';

const blinkWinnerMessageReducer = (state=null, action) => {
  let rv = state;

  if (NEW_GAME === action.type) {
    rv = {active: false, visible: false, winner: action.result};
  } else if (GAME_OVER === action.type) {
    rv = {active: true, visible: true, winner: action.result};
  } else if (WINNER_MESSAGE === action.type) {
    rv = {active: action.active,
      visible: action.active ? !state.visible : false,
      winner: action.result
    };
  }

  return rv;
};

export default blinkWinnerMessageReducer;
