export const AlgebricNotation2IndexMap = {
  "a1": 0, "b1": 1, "c1": 2, "d1": 3, "e1": 4, "f1": 5, "g1": 6, "h1": 7,
  "a2": 8, "b2": 9, "c2": 10, "d2": 11, "e2": 12, "f2": 13, "g2": 14, "h2": 15,
  "a3": 16, "b3": 17, "c3": 18, "d3": 19, "e3": 20, "f3": 21, "g3": 22, "h3": 23,
  "a4": 24, "b4": 25, "c4": 26, "d4": 27, "e4": 28, "f4": 29, "g4": 30, "h4": 31,
  "a5": 32, "b5": 33, "c5": 34, "d5": 35, "e5": 36, "f5": 37, "g5": 38, "h5": 39,
  "a6": 40, "b6": 41, "c6": 42, "d6": 43, "e6": 44, "f6": 45, "g6": 46, "h6": 47,
  "a7": 48, "b7": 49, "c7": 50, "d7": 51, "e7": 52, "f7": 53, "g7": 54, "h7": 55,
  "a8": 56, "b8": 57, "c8": 58, "d8": 59, "e8": 60, "f8": 61, "g8": 62, "h8": 63,
};

//In Javascript bit operations execute on 32-bit words
const A15_MASK = 0x1;
const B15_MASK = A15_MASK << 1;
const C15_MASK = B15_MASK << 1;
const D15_MASK = C15_MASK << 1;
const E15_MASK = D15_MASK << 1;
const F15_MASK = E15_MASK << 1;
const G15_MASK = F15_MASK << 1;
const H15_MASK = G15_MASK << 1;
const A26_MASK = H15_MASK << 1;
const B26_MASK = A26_MASK << 1;
const C26_MASK = B26_MASK << 1;
const D26_MASK = C26_MASK << 1;
const E26_MASK = D26_MASK << 1;
const F26_MASK = E26_MASK << 1;
const G26_MASK = F26_MASK << 1;
const H26_MASK = G26_MASK << 1;
const A37_MASK = H26_MASK << 1;
const B37_MASK = A37_MASK << 1;
const C37_MASK = B37_MASK << 1;
const D37_MASK = C37_MASK << 1;
const E37_MASK = D37_MASK << 1;
const F37_MASK = E37_MASK << 1;
const G37_MASK = F37_MASK << 1;
const H37_MASK = G37_MASK << 1;
const A48_MASK = H37_MASK << 1;
const B48_MASK = A48_MASK << 1;
const C48_MASK = B48_MASK << 1;
const D48_MASK = C48_MASK << 1;
const E48_MASK = D48_MASK << 1;
const F48_MASK = E48_MASK << 1;
const G48_MASK = F48_MASK << 1;
const H48_MASK = G48_MASK << 1;

const masks = [A15_MASK, B15_MASK, C15_MASK, D15_MASK, E15_MASK, F15_MASK, G15_MASK, H15_MASK,
  A26_MASK, B26_MASK, C26_MASK, D26_MASK, E26_MASK, F26_MASK, G26_MASK, H26_MASK,
  A37_MASK, B37_MASK, C37_MASK, D37_MASK, E37_MASK, F37_MASK, G37_MASK, H37_MASK,
  A48_MASK, B48_MASK, C48_MASK, D48_MASK, E48_MASK, F48_MASK, G48_MASK, H48_MASK];

export const POSITION_INIT_EMPTY = 0;
export const POSITION_INIT_START = 1;

export const SQUARE_EMPTY = 0;
export const SQUARE_LIGHT = 1;
export const SQUARE_DARK = 2;

export const PLAYER_NONE = 0;
export const PLAYER_LIGHT = SQUARE_LIGHT;
export const PLAYER_DARK = SQUARE_DARK;

function inBoard(file, row) {
  return file >= 0 && file < 8 && row >= 0 && row < 8;
}

function isBitOn(bitBoard, bitIndex) {
  return (bitBoard[Math.floor(bitIndex / 32)] & masks[bitIndex % 32]) !== 0;
}

function setBitOff(bitBoard, bitIndex) {
  bitBoard[Math.floor(bitIndex / 32)] &= ~(masks[bitIndex % 32]);
}

function setBitOn(bitBoard, bitIndex) {
  bitBoard[Math.floor(bitIndex / 32)] |= masks[bitIndex % 32];
}

const lines = [{ file: 0, row: 1 }, { file: 1, row: 1 }, { file: 1, row: 0 }, { file: 1, row: -1 },
  { file: 0, row: -1 }, { file: -1, row: -1 }, { file: -1, row: 0 }, { file: -1, row: 1 }];
const lineDirectionNames = ["north", "northEast", "east", "southEast",
  "south", "southWest", "west", "northWest"];

function generateBlockMasks()
{
  let rv = [];
  let sqi = 0;
  let compassi = 0;

  for (sqi = 0; sqi < 64; sqi++) {
    let blockMasks = {north: [0, 0], northEast: [0, 0], east: [0, 0], southEast: [0, 0],
      south: [0, 0], southWest: [0, 0], west: [0, 0], northWest: [0, 0]
    };

    for (compassi = 0; compassi < lines.length; compassi++) {
      let file = (sqi % 8) + lines[compassi].file;
      let row = Math.floor(sqi / 8) + lines[compassi].row;;

      while (inBoard(file, row)) {
        setBitOn(blockMasks[lineDirectionNames[compassi]], (row * 8) + file);
        file += lines[compassi].file;
        row += lines[compassi].row;
      }
    }
    rv.push(blockMasks);
  }

  return rv;
}

const blockMasksHelper = generateBlockMasks();

class Position {
  constructor(positionIntialize) {
    this.turn = PLAYER_NONE;
    this.lightStones = [0, 0];
    this.darkStones = [0, 0];
    this.legalMoves = [0, 0];
      //To be purist this properties are redundant, we can simply do board count.
      //Since the Position class intends to support playing engines also
      //I prefer to do the extra caching work as performance considaration.
    this.lightStonesCount = 0;
    this.darkStonesCount = 0;

    if (positionIntialize === POSITION_INIT_START) {
      this.lightStones[0] |= D48_MASK;
      this.lightStones[1] |= E15_MASK;
      this.darkStones[0] |= E48_MASK;
      this.darkStones[1] |= D15_MASK;
      this.lightStonesCount = 2;
      this.darkStonesCount = 2;

      this.legalMoves[0] |= D37_MASK;
      this.legalMoves[0] |= E37_MASK;
      this.legalMoves[0] |= C48_MASK;
      this.legalMoves[1] |= C15_MASK;
      this.legalMoves[1] |= D26_MASK;
      this.legalMoves[1] |= E26_MASK;
      this.legalMoves[0] |= F48_MASK;
      this.legalMoves[1] |= F15_MASK;

      this.turn = PLAYER_LIGHT;
    }
  }

  clone() {
    let rv = new Position(POSITION_INIT_EMPTY);

    rv.turn = this.turn;
    rv.lightStones[0] |= this.lightStones[0];
    rv.lightStones[1] |= this.lightStones[1];
    rv.darkStones[0] |= this.darkStones[0];
    rv.darkStones[1] |= this.darkStones[1];
    rv.legalMoves[0] |= this.legalMoves[0];
    rv.legalMoves[1] |= this.legalMoves[1];
    rv.lightStonesCount = this.lightStonesCount;
    rv.darkStonesCount = this.darkStonesCount;

    return rv;
  }

  flipBlocked(squareIndex) {
    let compassi = 0;
    let playingStones = [0, 0];
    let otherStones = [0, 0];

    if (PLAYER_LIGHT === this.turn) {
      playingStones = this.lightStones;
      otherStones = this.darkStones;
    } else {
      playingStones = this.darkStones;
      otherStones = this.lightStones;
    }

    for (compassi = 0; compassi < 8; compassi++) {
      let helperMask = [0, 0];

      helperMask = (blockMasksHelper[squareIndex])[lineDirectionNames[compassi]];
      if (((playingStones[0] & helperMask[0]) === 0) &&
        ((playingStones[1] & helperMask[1]) === 0)) {
        continue;
      }

      let isBlock = false;
      let flipMask = [0, 0];
      let file = (squareIndex % 8) + lines[compassi].file;
      let row = Math.floor(squareIndex / 8) + lines[compassi].row;;

      let flipCount = 0;
      while (inBoard(file, row)) {
        let sqi = (row * 8) + file;
        if (isBitOn(otherStones, sqi)) {
          setBitOn(flipMask, sqi);
          ++flipCount;
        } else if (isBitOn(playingStones, sqi)) {
          isBlock = true;
          break;
        } else {
          break;
        }
        file += lines[compassi].file;
        row += lines[compassi].row;
      }
      if (isBlock && (flipMask[0] !== 0 || flipMask[1] !== 0)) {
        this.lightStones[0] ^= flipMask[0];
        this.lightStones[1] ^= flipMask[1];
        this.darkStones[0] ^= flipMask[0];
        this.darkStones[1] ^= flipMask[1];

        if (PLAYER_LIGHT === this.turn) {
          this.lightStonesCount += flipCount;
          this.darkStonesCount -= flipCount;
        } else {
          this.lightStonesCount -= flipCount;
          this.darkStonesCount += flipCount;
        }
      }
    }
  }

  getSquareByAlgebricNotation(coordinates) {
    let rv = SQUARE_EMPTY;

    let sqi = AlgebricNotation2IndexMap[coordinates];
    let word = Math.floor(sqi / 32);
    let bit = sqi % 32;

    if ((this.lightStones[word] & masks[bit]) !== 0) {
      rv = SQUARE_LIGHT;
    } else if ((this.darkStones[word] & masks[bit]) !== 0) {
      rv = SQUARE_DARK;
    }

    return rv;
   }

   //Todo: For performance, consider cache them with the position
  legalMovesList() {
    let rv = [];
    let sqi = 0;

    for (sqi = 0; sqi < 64; sqi++)
    {
      if (isBitOn(this.legalMoves, sqi)) {
        rv.push(sqi);
      }
    }

    return rv;
  }

  move(squareIndex) {
    let rv = null;

    if (isBitOn(this.legalMoves, squareIndex)) {
      rv = this.clone();

      setBitOn((PLAYER_LIGHT === rv.turn) ? rv.lightStones : rv.darkStones,
        squareIndex);

      if (PLAYER_LIGHT === rv.turn) {
        rv.lightStonesCount = rv.lightStonesCount + 1;
      } else {
        rv.darkStonesCount = rv.darkStonesCount + 1;
      }

      rv.flipBlocked(squareIndex);      //blocks!

      rv.turn = (PLAYER_LIGHT === rv.turn) ? PLAYER_DARK : PLAYER_LIGHT;

      //legal moves
      setBitOff(rv.legalMoves, squareIndex);

      const row = Math.floor(squareIndex / 8);
      const file = squareIndex % 8;
      const fullBaared = [rv.lightStones[0] | rv.darkStones[0],
        rv.lightStones[1] | rv.darkStones[1]];

      if (inBoard(file, row + 1)) {
        if (!isBitOn(fullBaared, squareIndex + 8)) {
          setBitOn(rv.legalMoves, squareIndex + 8);
        }
      }
      if (inBoard(file + 1, row)) {
        if (!isBitOn(fullBaared, squareIndex + 1)) {
          setBitOn(rv.legalMoves, squareIndex + 1);
        }
      }
      if (inBoard(file, row - 1)) {
        if (!isBitOn(fullBaared, squareIndex - 8)) {
          setBitOn(rv.legalMoves, squareIndex - 8);
        }
      }
      if (inBoard(file - 1, row)) {
        if (!isBitOn(fullBaared, squareIndex - 1)) {
          setBitOn(rv.legalMoves, squareIndex - 1);
        }
      }
    }

    return rv;
  }

}

export default Position;
