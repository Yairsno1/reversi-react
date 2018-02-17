import {NEW_GAME} from '../actions';

const newGameReducer = (state=null, action) => {
  let rv = state;

  if (NEW_GAME === action.type) {
    rv = action.game;
  }

  return rv;
};

export default newGameReducer;
