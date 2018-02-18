import { NEW_GAME, PLAYER_MOVED } from '../actions';

const resultReducer = (state=[], action) => {
  let rv = state;

  if (NEW_GAME === action.type)
  {
    rv = [];
  } else if (PLAYER_MOVED === action.type) {
    rv = [...state, action.move];
  }

  return rv;
};

export default resultReducer;
