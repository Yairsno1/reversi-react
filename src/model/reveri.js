import {PLAYER_DARK} from './position';

const VALUE_OF_SQUARES = [2, 0.8, 1.5, 0.9, 0.9, 1.5, 0.8, 2,
  0.8, 1, 0.8, 1, 1, 0.8, 1, 0.8,
  1.5, 0.8, 1.25, 0.9, 0.9, 1.25, 0.8, 1.5,
  0.9, 1, 0.9, 1, 1, 0.9, 1, 0.9,
  0.9, 1, 0.9, 1, 1, 0.9, 1, 0.9,
  1.5, 0.8, 1.25, 0.9, 0.9, 1.25, 0.8, 1.5,
  0.8, 1, 0.8, 1, 1, 0.8, 1, 0.8,
  2, 0.8, 1.5, 0.9, 0.9, 1.5, 0.8, 2];

class Revery {
  constructor(game, color) {
    this.game = game;
    this.myColor = color;
  }

  calculate() {
    let rv = -1;
    let currPos;
    let legalMoves;
    let candidates;
    let maxPosition = -999999;

    currPos = this.game.currentPosition.clone();
    legalMoves = currPos.legalMovesList();
    if (legalMoves.length > 0) {
      candidates =  this.getMaxSquares(legalMoves);

      if (1 === candidates.length) {
        rv = candidates[0];
      } else if (candidates.length > 1) {
        rv = candidates[0]; //default

        let i = 0;
        let posEval;
        for (i = 0; i < candidates.length; i++) {
          posEval = this.evalPosition(currPos.move(candidates[i]));
          if (posEval > maxPosition) {
            rv = candidates[i];
            maxPosition = posEval;
          }
        }
      }
    }

    return rv;
  }

  evalPosition(pos) {
    let rv = 0;

    rv = pos.lightStonesCount - pos.darkStonesCount;
    if (PLAYER_DARK === this.myColor) {
      rv *= -1;
    }

    return rv;
  }

  getMaxSquares(legalMoves) {
    let rv = [];
    let maxSq = -0.1;
    let i = 0;

    for (i = 0; i < legalMoves.length; i++) {
      if (VALUE_OF_SQUARES[legalMoves[i]] > maxSq) {
        maxSq = VALUE_OF_SQUARES[legalMoves[i]];
        rv = [legalMoves[i]];
      } else if (VALUE_OF_SQUARES[legalMoves[i]] === maxSq) {
        rv.push(legalMoves[i]);
      }
    }

    return rv;
  }
}

export default Revery;
