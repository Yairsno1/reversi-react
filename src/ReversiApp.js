import './css/ReversiApp.css';
import './css/frmNewGame.css';
import React, { Component } from 'react';
import * as APP_CONST from './appConst';
import Game, * as GAME_CONST from './model/game';
import /*Position,*/ {PLAYER_LIGHT, PLAYER_DARK} from './model/position';
import Indicators from './indicators.js';
import GameManagement from './gameManagement';
import Board from './board';
import ScoreSheet from './scoreSheet';
import NewGameForm from './newGameForm';
import Reveri from './model/reveri';

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

    const game = new Game();
    game.start();
    //We store the viewed position separate from the game because it
    //has one of two sources, the active game or from post-game replay.
    const pos = game.currentPosition.clone(); //Copy of the position, view-only.
    const uiState = APP_CONST.UI_STATE_GAME_TO_START;
    const myColor = PLAYER_LIGHT;
    const opponentKind = APP_CONST.OPPONENT_KIND_ENGINE;

    this.engine = null;
    this.blinkArgs = {Id: -1, count: 0};

    this.state = ({
      game: game,
      position: {position: pos, currMove: ''},
      uiState: uiState,
      opponentKind: opponentKind,
      myColor: myColor,
      showNewGameForm: false,
      blinkWinnerMessage: {active: false, visible: false, winner: GAME_CONST.GAME_SCORE_NA},
    });
  }

  playerMoved(move, pos) {
    const uiState = this.state.uiState;
    let nextStateObj = null;
    let blinkWinMsg = null;

    nextStateObj = {position: {position: pos, currMove: move, },};

    if (GAME_CONST.GAME_STATUS_OVER === this.state.game.status) {
      blinkWinMsg = {active: false, visible: false, winner: GAME_CONST.GAME_SCORE_NA};

      this.blinkArgs.Id = setInterval(() => this.handleWinnerBlink(), 750);

      nextStateObj.uiState = APP_CONST.getUINextState(uiState, APP_CONST.UI_OP_ENDED);

      blinkWinMsg.active = true;
      blinkWinMsg.visible = true;
      blinkWinMsg.winner = this.state.game.result;
      nextStateObj.blinkWinnerMessage = blinkWinMsg
    }

    this.setState(nextStateObj);
  }

  tryMove(squareByAlgebricNotation) {
    //This is helper function.
    //It doesn't change this Components' state.
    //If mutating of state is required, the responsibility
    //is on the callers.
    let rv = null;

    const newPosition = this.state.game.move(squareByAlgebricNotation);
    if (null !== newPosition) {
      rv = newPosition.clone();
    }

    return rv;
  }

  //*** Controller ***
  //Todo: Migrate to Redux

  //=== New Game Form ===
  handleNewGameFormClose() {
    this.setState({showNewGameForm: false});
  }

  handleNewGameFormGo(whichOpponent, whichColor) {
    this.handleNewGameFormClose();

    const prevUIState = this.state.uiState;
    const nextUIState = APP_CONST.getUINextState(this.state.uiState, APP_CONST.UI_OP_PLAY);
    const isEngineOpponent = APP_CONST.OPPONENT_KIND_ENGINE === whichOpponent;

    let game = this.state.game;
    let pos = this.state.position.position;
    if (APP_CONST.UI_STATE_CANCELED === prevUIState ||
      APP_CONST.UI_STATE_END_OF_GAME === prevUIState) {
        game = new Game();
        game.start();
        pos = game.currentPosition.clone();

    }
    if (isEngineOpponent) {
      this.engine = new Reveri(game, PLAYER_LIGHT === whichColor ? PLAYER_DARK : PLAYER_LIGHT);
    }

    this.setState({
      game: game,
      position: {position: pos, currMove: '', },
      uiState: nextUIState,
      opponentKind: whichOpponent,
      myColor: whichColor,
    });

    if (isEngineOpponent && PLAYER_DARK === whichColor) {
      setTimeout(this.handleEngineMove, 1000);
    }
  }

  //=== Indicators ===
  handleNewGameFormShow() {
    const uiState = this.state.uiState;

    if (APP_CONST.UI_STATE_CANCELED === uiState ||
      APP_CONST.UI_STATE_END_OF_GAME === uiState ||
      APP_CONST.UI_STATE_GAME_TO_START === uiState) {
        this.setState({showNewGameForm: true});
      }
  }

  handleWinnerBlink() {
    const maxCount = 6;

    if (APP_CONST.UI_STATE_END_OF_GAME === this.state.uiState) {
      this.blinkArgs.count = this.blinkArgs.count + 1;
      if (maxCount === this.blinkArgs.count) {
        clearInterval(this.blinkArgs.Id);
        this.blinkArgs.Id = -1;
        this.blinkArgs.count = 0;
      }

      this.setState(function(prevState, props) {
        return {blinkWinnerMessage: {
          active: this.blinkArgs.count > 0,
          visible: !prevState.blinkWinnerMessage.visible,
          winner: prevState.game.result},
        };
      });
    }

  }

  //=== Game management ===
  handlePuaseResume() {
    const currUIState = this.state.uiState;
    if (APP_CONST.UI_STATE_PLAYING === currUIState ||
      APP_CONST.UI_STATE_PAUSE === currUIState) {
      const op = (APP_CONST.UI_STATE_PLAYING === currUIState) ?
        APP_CONST.UI_OP_PAUSE :
        APP_CONST.UI_OP_RESUME;
      const nextUIState = APP_CONST.getUINextState(currUIState, op);

      this.setState({
        uiState: nextUIState,
      });

      if (APP_CONST.UI_STATE_PLAYING === nextUIState &&
        APP_CONST.OPPONENT_KIND_ENGINE === this.state.opponentKind &&
        this.state.myColor !== this.state.position.position.turn)
        {
          setTimeout(this.handleEngineMove, 1000);
        }
    }
  }

  handleCancel() {
    const currUIState = this.state.uiState;
    if (APP_CONST.UI_STATE_PLAYING === currUIState ||
      APP_CONST.UI_STATE_PAUSE === currUIState) {
        const nextUIState = APP_CONST.getUINextState(currUIState, APP_CONST.UI_OP_CANCEL);

        this.setState({
          uiState: nextUIState,
        });
      }
  }

  //=== Board ===
  handleSquareClick(file, row) {
    const uiState = this.state.uiState;
    const isEngineOpponent = (APP_CONST.OPPONENT_KIND_ENGINE === this.state.opponentKind);
    const myTurn = (this.state.myColor === this.state.position.position.turn);
    let pos = null;

    if (APP_CONST.UI_STATE_PLAYING === uiState) {
      if (!isEngineOpponent || (isEngineOpponent && myTurn)) {
        pos = this.tryMove(file + row);
        if (null !== pos) {
          this.playerMoved(file + row, pos);

          if (isEngineOpponent) {
            setTimeout(this.handleEngineMove, 1000);
          }
        }
      }
    }
  }

  handleEngineMove() {
    const uiState = this.state.uiState;
    const isEngineOpponent = (APP_CONST.OPPONENT_KIND_ENGINE === this.state.opponentKind);
    const engineTurn = (this.state.myColor !== this.state.position.position.turn);
    let pos = null;

    if (APP_CONST.UI_STATE_PLAYING === uiState) {
      if (isEngineOpponent && engineTurn) {
        let sqi = this.engine.calculate();
        if (sqi >= 0) {
          const sqAlgebricNotation = APP_CONST.index2AlgebricNotationMap[sqi];

          pos = this.tryMove(sqAlgebricNotation);
          if (null !== pos) {
            this.playerMoved(sqAlgebricNotation, pos);
          }
        }
      }
    }
  }

  //=== Score sheet ===
  handleSheetCellClick(ply) {
    const uiState = this.state.uiState;

    if (APP_CONST.UI_STATE_END_OF_GAME === uiState ||
      APP_CONST.UI_STATE_CANCELED === uiState) {

      const positions = this.state.game.positions;
      if (ply <= positions.length) {
        const pos = positions[ply];
        this.setState({
          position: {position: pos, currMove: this.state.game.moves[ply-1], },
        });
      }
    }
  }
  //******************/

  render() {
    return (
      <div>
        <NewGameForm
          currOpponentKind={this.state.opponentKind}
          currMyColor={this.state.myColor}
          display={this.state.showNewGameForm}
          onClose={this.handleNewGameFormClose}
          onGo={this.handleNewGameFormGo}/>
        <div>
          <Indicators uiState={this.state.uiState}
            opponentKind={this.state.opponentKind}
            myColor={this.state.myColor}
            blinkWinnerMessage={this.state.blinkWinnerMessage}
            playerToMove={this.state.position.position.turn}
            onOpponentTypeClick={this.handleNewGameFormShow}/>
        </div>
        <div className="page-row">
          <GameManagement uiState={this.state.uiState}
            onPuseResume={this.handlePuaseResume}
            onCancel={this.handleCancel}/>
          <Board position={this.state.position}
            moves={this.state.game.moves}
            onMove={(f,r) => this.handleSquareClick(f,r)}/>
          <ScoreSheet uiState={this.state.uiState}
            result={this.state.game.result}
            position={this.state.position}
            moves={this.state.game.moves}
            onCellClick={this.handleSheetCellClick}/>
        </div>
      </div>
    );
  }
}

export default ReversiApp;
