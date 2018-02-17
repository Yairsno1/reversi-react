import {NEW_GAME} from '../actions';

const opponentKindReducer = (state=0, action) => {
  let rv = state;

  if (NEW_GAME === action.type) {
    rv = action.opponentKind;
  }

  return rv;
};

export default opponentKindReducer;
