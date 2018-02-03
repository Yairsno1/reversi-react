import Position from './position';
import {POSITION_INIT_EMPTY,
        POSITION_INIT_START,
        AlgebricNotation2IndexMap} from './position';

export const GAME_STATUS_OFF = 1;
export const GAME_STATUS_ON = 2;
export const GAME_STATUS_OVER = 3;

export const GAME_SCORE_NA = 0;
export const GAME_SCORE_WIN_LIGHT = 1;
export const GAME_SCORE_DRAW = 2;
export const GAME_SCORE_WIN_DARK = 3;

class Game {
  constructor() {
    this.status = GAME_STATUS_OFF;
    this.positions = [new Position(POSITION_INIT_EMPTY)];
    this.moves = [];
  }

  get currentPosition() {
    return this.positions[this.positions.length - 1];
  }

  get result()
  {
    let rv = GAME_SCORE_NA;

    if (GAME_STATUS_OVER === this.status) {
      const pos = this.positions[this.positions.length - 1];

      let lightStonesNum = pos.lightStonesCount;
      let darkStonesNum = pos.darkStonesCount;
      if (lightStonesNum > darkStonesNum) {
        rv = GAME_SCORE_WIN_LIGHT;
      } else if (lightStonesNum < darkStonesNum) {
        rv = GAME_SCORE_WIN_DARK;
      } else {
        rv = GAME_SCORE_DRAW;
      }
    }

    return rv;
  }

  move(squareByAlegebricNotation) {
    let rv = null;

    if (GAME_STATUS_ON === this.status) {
      rv = this.positions[this.positions.length - 1].move(AlgebricNotation2IndexMap[squareByAlegebricNotation]);
      if (rv !== null) {
        this.positions.push(rv);
        this.moves.push(squareByAlegebricNotation);

        if (61/*60 plys+initial position*/ === this.positions.length) {
          this.status = GAME_STATUS_OVER;
        }
      }
    }

    return rv;
  }

  start() {
    this.status = GAME_STATUS_ON;
    this.moves = [];
    this.positions = [];
    this.positions.push(new Position(POSITION_INIT_START));
  }
}

export default Game;
