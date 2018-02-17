import {NEW_GAME, PLAYER_MOVED, REPLAY} from '../actions';

const positionReducer = (state=null, action) => {
  let rv = state;

  if (NEW_GAME === action.type) {
    const pos = action.game.currentPosition.clone();
    rv = {position: pos, currMove: '', };
  } else if (PLAYER_MOVED === action.type) {
    rv = {position: action.position, currMove: action.move,};
  } else if (REPLAY === action.type) {
    rv = {position: action.position, currMove: action.move,};
  }

  return rv;
};

export default positionReducer;
