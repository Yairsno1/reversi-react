/*
* Containes callbacks that fired by user events and async events.
* TBD: split the controller accorgding to view sections:
*   Indicators, Game Management etc.
*/

import React, { Component } from 'react';
import ReversiApp from './ReversiApp';
import * as APP_CONST from './appConst';
import {PLAYER_LIGHT, PLAYER_DARK} from './model/position';
import Game, * as GAME_CONST from './model/game';
import Reveri from './model/reveri';

import { showNewGameFormAction,
  newGameAction,
  playerMovedAction,
  gameOverAction,
  gameCanceledAction,
  gamePausedResumedAction,
  winnerMessageAction,
  replayAction } from './actions';

class ReversiController extends Component {
  constructor(props) {
    super(props);

    this.handleNewGameFormClose = this.handleNewGameFormClose.bind(this);
    this.handleNewGameFormGo = this.handleNewGameFormGo.bind(this);
    this.handleNewGameFormShow = this.handleNewGameFormShow.bind(this);
    this.handlePuaseResume = this.handlePuaseResume.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleWinnerBlink = this.handleWinnerBlink.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.handleEngineMove = this.handleEngineMove.bind(this);
    this.handleSheetCellClick = this.handleSheetCellClick.bind(this);

    //Model:
    this.game = new Game();
    this.game.start();
    this.engine = null;

    this.blinkArgs = {Id: -1, count: 0};
  }

  playerMoved(dispatch, move, pos) {
    dispatch(playerMovedAction(move, pos));

    const game = this.game;
    if (GAME_CONST.GAME_STATUS_OVER === game.status) {
      this.blinkArgs.Id = setInterval(() => {this.handleWinnerBlink(dispatch);}, 750);

      dispatch(gameOverAction(game.result));
    }
  }

  tryMove(squareByAlgebricNotation) {
    //This is helper function.
    //It doesn't change this Components' state.
    //If mutating of state is required, the responsibility
    //is on the callers.
    let rv = null;

    const newPosition = this.game.move(squareByAlgebricNotation);
    if (null !== newPosition) {
      rv = newPosition.clone();
    }

    return rv;
  }

  //=== New Game Form ===
  handleNewGameFormClose(dispatch) {
    dispatch(showNewGameFormAction(false));
  }

  handleNewGameFormGo(dispatch, whichOpponent, whichColor) {
    dispatch(showNewGameFormAction(false));

    const prevState = this.props.store.getState();

    const prevUIState = prevState.uiState;

    if (APP_CONST.UI_STATE_CANCELED === prevUIState ||
      APP_CONST.UI_STATE_END_OF_GAME === prevUIState) {
        this.game = new Game();
        this.game.start();
    }
    const game = this.game;

    dispatch(newGameAction(whichOpponent, whichColor, game.currentPosition.clone()));

    if (APP_CONST.OPPONENT_KIND_ENGINE === whichOpponent) {
      this.engine = new Reveri(game, PLAYER_LIGHT === whichColor ? PLAYER_DARK : PLAYER_LIGHT);

      if (PLAYER_DARK === whichColor) {
        setTimeout(() => {this.handleEngineMove(dispatch);}, 1000);
      }
    }
  }

  //=== Indicators ===
  handleNewGameFormShow(dispatch) {
    const uiState = this.props.store.getState().uiState;

    if ((APP_CONST.UI_STATE_CANCELED === uiState ||
      APP_CONST.UI_STATE_END_OF_GAME === uiState ||
      APP_CONST.UI_STATE_GAME_TO_START === uiState)) {
        dispatch(showNewGameFormAction(true));
      }
  }

  handleWinnerBlink(dispatch) {
    const maxCount = 6;

    const currState = this.props.store.getState();

    if (APP_CONST.UI_STATE_END_OF_GAME === currState.uiState) {
      this.blinkArgs.count = this.blinkArgs.count + 1;
      if (maxCount === this.blinkArgs.count) {
        clearInterval(this.blinkArgs.Id);
        this.blinkArgs.Id = -1;
        this.blinkArgs.count = 0;
      }

      dispatch(winnerMessageAction(
        this.blinkArgs.count > 0,
        this.game.result));
    }

  }

  //=== Game management ===
  handlePuaseResume(dispatch) {
    const currUIState = this.props.store.getState().uiState;

    if (APP_CONST.UI_STATE_PLAYING === currUIState ||
      APP_CONST.UI_STATE_PAUSE === currUIState) {
      const op = (APP_CONST.UI_STATE_PLAYING === currUIState) ?
        APP_CONST.UI_OP_PAUSE :
        APP_CONST.UI_OP_RESUME;

      dispatch(gamePausedResumedAction(op));

      const nextState = this.props.store.getState();
      const nextUIState = nextState.uiState;
      if (APP_CONST.UI_STATE_PLAYING === nextUIState &&
        APP_CONST.OPPONENT_KIND_ENGINE === nextState.opponentKind &&
        nextState.myColor !== nextState.position.position.turn)
        {
          setTimeout(() => {this.handleEngineMove(dispatch);}, 1000);
        }
    }
  }

  handleCancel(dispatch) {
    const currUIState = this.props.store.getState().uiState;

    if (APP_CONST.UI_STATE_PLAYING === currUIState ||
      APP_CONST.UI_STATE_PAUSE === currUIState) {
        dispatch(gameCanceledAction());
      }
  }

  //=== Board ===
  handleSquareClick(dispatch,file, row) {
    const currState = this.props.store.getState();

    const uiState = currState.uiState;
    const isEngineOpponent = (APP_CONST.OPPONENT_KIND_ENGINE === currState.opponentKind);
    const myTurn = (currState.myColor === currState.position.position.turn);
    let pos = null;

    if (APP_CONST.UI_STATE_PLAYING === uiState) {
      if (!isEngineOpponent || (isEngineOpponent && myTurn)) {
        pos = this.tryMove(file + row);
        if (null !== pos) {
          this.playerMoved(dispatch, file + row, pos);

          if (isEngineOpponent) {
            setTimeout(() => {this.handleEngineMove(dispatch);}, 1000);
          }
        }
      }
    }
  }

  handleEngineMove(dispatch) {
    const currState = this.props.store.getState();

    const uiState = currState.uiState;
    const isEngineOpponent = (APP_CONST.OPPONENT_KIND_ENGINE === currState.opponentKind);
    const engineTurn = (currState.myColor !== currState.position.position.turn);
    let pos = null;

    if (APP_CONST.UI_STATE_PLAYING === uiState) {
      if (isEngineOpponent && engineTurn) {
        let sqi = this.engine.calculate();
        if (sqi >= 0) {
          const sqAlgebricNotation = APP_CONST.index2AlgebricNotationMap[sqi];

          pos = this.tryMove(sqAlgebricNotation);
          if (null !== pos) {
            this.playerMoved(dispatch,sqAlgebricNotation, pos);
          }
        }
      }
    }
  }

  //=== Score sheet ===
  handleSheetCellClick(dispatch, ply) {
    const currState = this.props.store.getState();
    const uiState = currState.uiState;

    if (APP_CONST.UI_STATE_END_OF_GAME === uiState ||
      APP_CONST.UI_STATE_CANCELED === uiState) {

      const positions = this.game.positions;
      if (ply < positions.length) {
        const pos = positions[ply];
        dispatch(replayAction(this.game.moves[ply-1], pos));
      }
    }
  }
  //******************/

  render () {
    const handlers = {
      newGameFormClose: this.handleNewGameFormClose,
      newGameFormGo: this.handleNewGameFormGo,
      newGameFormShow: this.handleNewGameFormShow,
      puaseResume: this.handlePuaseResume,
      cancel: this.handleCancel,
      squareClick: this.handleSquareClick,
      sheetCellClick: this.handleSheetCellClick,
    };

    return (
      <ReversiApp eventHandlers={handlers}/>
    );
  }
};

export default ReversiController;
