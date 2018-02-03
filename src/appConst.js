
export const OPPONENT_KIND_ENGINE = 1;
export const OPPONENT_KIND_PLAYER = 2;

export const LAST_MOVE_INDEX = 61;

export const UI_STATE_GAME_TO_START = 0;
export const UI_STATE_PLAYING = 1;
export const UI_STATE_PAUSE = 2;
export const UI_STATE_CANCELED = 3;
export const UI_STATE_END_OF_GAME = 4;
export const UI_STATES_COUNT = 5;

export const UI_OP_PLAY = 0;
export const UI_OP_PAUSE = 1;
export const UI_OP_RESUME = 2;
export const UI_OP_CANCEL = 3;
export const UI_OP_ENDED = 4;
export const UI_OP_COUNT = 5;

export const index2AlgebricNotationMap = ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
      'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
      'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
      'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
      'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
      'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
      'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
      'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'];

export function getUINextState(currState, operation) {
  const uiTransitionsTable = [[UI_STATE_PLAYING, UI_STATE_GAME_TO_START, UI_STATE_GAME_TO_START, UI_STATE_GAME_TO_START, UI_STATE_GAME_TO_START],
  [UI_STATE_PLAYING, UI_STATE_PAUSE, UI_STATE_PLAYING, UI_STATE_CANCELED, UI_STATE_END_OF_GAME],
  [UI_STATE_PLAYING, UI_OP_PAUSE, UI_STATE_PLAYING, UI_STATE_CANCELED, UI_STATE_PAUSE],
  [UI_STATE_PLAYING, UI_STATE_CANCELED, UI_STATE_CANCELED, UI_STATE_CANCELED, UI_STATE_CANCELED],
  [UI_STATE_PLAYING, UI_STATE_END_OF_GAME, UI_STATE_END_OF_GAME, UI_STATE_END_OF_GAME, UI_STATE_END_OF_GAME]];

  let rv = currState;
  if (currState >= UI_STATE_GAME_TO_START && currState < UI_STATES_COUNT) {
    if (operation >= UI_OP_PLAY && operation < UI_OP_COUNT) {
      rv = (uiTransitionsTable[currState])[operation];
    }
  }

  return rv;
}

function isElementInViewport(parent, elem) {
  let rv = true;

  if (null !== parent && undefined !== parent &&
    null !== elem && undefined !== elem) {
    let elemRect = elem.getBoundingClientRect();
    let parentRect = parent.getBoundingClientRect();

    rv = elemRect.top >= parentRect.top &&
      elemRect.left >= parentRect.left &&
      elemRect.bottom <= parentRect.bottom &&
      elemRect.right <= parentRect.right;
  }

  return rv;
}

export function ScrollTableRowToView(rowNum) {
  const parent = document.getElementById("move-list-panel");
  const elem = document.getElementById("move-b-" + rowNum);

  if (!isElementInViewport(parent, elem)) {
    elem.scrollIntoView(true);
  }
}

export function ScrollTableRowToView2(parent, cell) {

  if (!isElementInViewport(parent, cell)) {
    cell.scrollIntoView(true);
  }
}
