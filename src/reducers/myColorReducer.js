import {NEW_GAME} from '../actions';

const myColorReducer = (state=0, action) => {
  let rv = state;

  if (NEW_GAME === action.type) {
    rv = action.myColor;
  }

  return rv;
};

export default myColorReducer;
