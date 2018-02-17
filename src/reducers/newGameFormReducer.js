import {SHOW_NEW_GAME_FORM} from '../actions';

const newGameFormReducer = (state=false, action) => {
  let rv = state;

  if (SHOW_NEW_GAME_FORM === action.type) {
    rv = action.display;
  }

  return rv;
};

export default newGameFormReducer;
