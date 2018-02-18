//action types
export const GAME_CANCELED = 'GAME_CANCELED';
export const GAME_OVER = 'GAME_OVER';
export const GAME_PAUSED_RESUMED = 'GAME_PAUSED_RESUMED';
export const REPLAY = 'REPLAY';
export const NEW_GAME = 'NEW_GAME';
export const PLAYER_MOVED = 'PLAYER_MOVED';
export const SHOW_NEW_GAME_FORM = 'SHOW_NEW_GAME_FORM';
export const WINNER_MESSAGE = 'WINNER_MESSAGE';

// --- action creators ---
export function gameCanceledAction() {
  return {
    type: GAME_CANCELED,
  };
}

export function gameOverAction(result) {
  return {
    type: GAME_OVER,
    result: result,
  };
}

export function gamePausedResumedAction(operation) {
  return {
    type: GAME_PAUSED_RESUMED,
    op: operation,
  };
}

export function newGameAction(whichOpponent, whichMyColor, initialPosition) {
  return {
    type: NEW_GAME,
    position: initialPosition,
    opponentKind: whichOpponent,
    myColor: whichMyColor,
  };
}

export function playerMovedAction(move, newPosition) {
  return {
    type: PLAYER_MOVED,
    move: move,
    position: newPosition,
  };
}

export function replayAction(move, newPosition) {
  return {
    type: REPLAY,
    move: move,
    position: newPosition,
  };
}

export function showNewGameFormAction(display) {
  return {
    type: SHOW_NEW_GAME_FORM,
    display: display,
  };
}

export function winnerMessageAction(active, result) {
  return {
    type: WINNER_MESSAGE,
    active: active,
    result: result,
  };
}
