import './css/ReversiApp.css';
import './css/frmNewGame.css';
import React, { Component } from 'react';
import * as APP_CONST from './appConst';
import Game, * as GAME_CONST from './model/game';
import /*Position,*/ {PLAYER_LIGHT, PLAYER_DARK} from './model/position';

import Reveri from './model/reveri';

import IndicatorsContainer from './containers/indicatorsContainer';
import GameManagementContainer from './containers/gameManagementContainer';
import BoardContainer from './containers/boardContainer';
import ScoreSheetContainer from './containers/scoreSheetContainer';
import NewGameFormContainer from './containers/newGameFormContainer';

import { showNewGameFormAction,
  newGameAction,
  playerMovedAction,
  gameOverAction,
  gameCanceledAction,
  gamePausedResumedAction,
  winnerMessageAction,
  replayAction } from './actions';

class ReversiApp extends Component {
  constructor(props) {
    super(props);

    this.handleNewGameFormClose = this.handleNewGameFormClose.bind(this);
    this.handleNewGameFormGo = this.handleNewGameFormGo.bind(this);
    this.handleNewGameFormShow = this.handleNewGameFormShow.bind(this);
    this.handlePuaseResume = this.handlePuaseResume.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleWinnerBlink = this.handleWinnerBlink.bind(this);
    this.handleEngineMove = this.handleEngineMove.bind(this);
    this.handleSheetCellClick = this.handleSheetCellClick.bind(this);

    this.engine = null;
    this.blinkArgs = {Id: -1, count: 0};
  }

  playerMoved(dispatch, move, pos) {
    dispatch(playerMovedAction(move, pos));

    const game = this.props.store.getState().game;
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

    const newPosition = this.props.store.getState().game.move(squareByAlgebricNotation);
    if (null !== newPosition) {
      rv = newPosition.clone();
    }

    return rv;
  }

  //*** Controller ***
  //Todo: Migrate to Redux

  //=== New Game Form ===
  handleNewGameFormClose(dispatch) {
    dispatch(showNewGameFormAction(false));
  }

  handleNewGameFormGo(dispatch, whichOpponent, whichColor) {
    dispatch(showNewGameFormAction(false));

    const prevState = this.props.store.getState();

    const prevUIState = prevState.uiState;

    let game = prevState.game;
    if (APP_CONST.UI_STATE_CANCELED === prevUIState ||
      APP_CONST.UI_STATE_END_OF_GAME === prevUIState) {
        game = new Game();
        game.start();
    }
    dispatch(newGameAction(game, whichOpponent, whichColor));

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
        currState.game.result));
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

      const positions = currState.game.positions;
      if (ply < positions.length) {
        const pos = positions[ply];
        dispatch(replayAction(currState.game.moves[ply-1], pos));
      }
    }
  }
  //******************/

  render() {
    return (
      <div>
        <NewGameFormContainer
          onClose={this.handleNewGameFormClose}
          onGo={this.handleNewGameFormGo}
        />
        <div>
          <IndicatorsContainer
            onOpponentTypeClick={this.handleNewGameFormShow}
          />
        </div>
        <div className="page-row">
          <GameManagementContainer
            onPuseResume={this.handlePuaseResume}
            onCancel={this.handleCancel}
          />
          <BoardContainer
            onMove={(dispatch,f,r) => this.handleSquareClick(dispatch,f,r)}
          />
          <ScoreSheetContainer
            onCellClick={this.handleSheetCellClick}
          />
        </div>
      </div>
    );
  }
}

export default ReversiApp;
