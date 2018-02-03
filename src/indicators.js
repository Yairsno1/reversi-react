import './css/ReversiApp.css';
import React, { Component } from 'react';
import * as APP_CONST from './appConst';
import {PLAYER_LIGHT} from './model/position';
import * as GAME_CONST from './model/game';

function OpponentType(props)
{
  const playerPerson = 'person';
  const playerComputer = 'computer';
  const playerOpponentPerson = 'person_add';

  let cursor = 'pointer';
  let whitePlayerKind = playerPerson;
  let blackPlayerKind = playerComputer;

  if (APP_CONST.OPPONENT_KIND_ENGINE === props.opponentKind) {
    whitePlayerKind = (PLAYER_LIGHT === props.myColor) ? playerPerson : playerComputer;
    blackPlayerKind = (PLAYER_LIGHT === props.myColor) ? playerComputer : playerPerson;
  } else {
    whitePlayerKind = (PLAYER_LIGHT === props.myColor) ? playerPerson : playerOpponentPerson;
    blackPlayerKind = (PLAYER_LIGHT === props.myColor) ? playerOpponentPerson : playerPerson;
  }

  switch (props.uiState) {
    case APP_CONST.UI_STATE_GAME_TO_START:
    //The UI state at startup is dictated by the HTML/CSS
      break;
    case APP_CONST.UI_STATE_CANCELED:
      break;
    case APP_CONST.UI_STATE_END_OF_GAME:
      break;
    case APP_CONST.UI_STATE_PLAYING:
      cursor = 'auto';
      break;
    case APP_CONST.UI_STATE_PAUSE:
      cursor = 'auto';
      break;
    default:
      break;
  }

  const playerKindStyle = {
    cursor: cursor,
  };

  return (
    <div id={'opponent-type'} className={'indicators-column'}>
      <span id={'lblPlayerWhite'} className={'material-icons'} style={playerKindStyle} onClick={props.onOpponentTypeClick}>{whitePlayerKind}</span>
      <span id={'lblVs'} className={'material-icons'}>compare_arrows</span>
      <span id={'lblPlayerBlack'} className={'material-icons'} style={playerKindStyle} onClick={props.onOpponentTypeClick}>{blackPlayerKind}</span>
    </div>
  );
}

function Message(props) {
  let text = 'Select color to start playing';
  let textColor = 'white';

  switch (props.uiState) {
    case APP_CONST.UI_STATE_GAME_TO_START:
    //The UI state at startup is dictated by the HTML/CSS
      break;
    case APP_CONST.UI_STATE_CANCELED:
      text = 'Select color to play a new game';
      break;
    case APP_CONST.UI_STATE_END_OF_GAME:
      if (props.blinkWinnerMessage.active) {
        const winner = props.blinkWinnerMessage.winner;
        const visible = props.blinkWinnerMessage.visible;
        if (GAME_CONST.GAME_SCORE_WIN_LIGHT === winner) {
          text = visible ? 'White wins' : '';
        } else if (GAME_CONST.GAME_SCORE_DRAW === winner) {
          text = visible ? 'Draw' : '';
        } else {
          text = visible ? 'Black wins' : '';
          textColor = 'black';
        }
      } else {
        text = 'Select color to play again';
      }
      break;
    case APP_CONST.UI_STATE_PLAYING:
      text = '';
      break;
    case APP_CONST.UI_STATE_PAUSE:
      text = 'Click resume to continue';
      break;
    default:
      break;
  }

  const textStyle = {
    color: textColor,
  };

  return (
      <div id='messages' className='indicators-column' style={textStyle}>
        {text}
      </div>
  );
}

function PlayerToMove(props) {
  const color = PLAYER_LIGHT === props.turn ? 'white' : 'black';
  let visibility = 'hidden';

  switch (props.uiState) {
    case APP_CONST.UI_STATE_GAME_TO_START:
    //The UI state at startup is dictated by the HTML/CSS
      break;
    case APP_CONST.UI_STATE_CANCELED:
      break;
    case APP_CONST.UI_STATE_END_OF_GAME:
      break;
    case APP_CONST.UI_STATE_PLAYING:
      visibility = 'visible';
      break;
    case APP_CONST.UI_STATE_PAUSE:
      visibility = 'visible';
      break;
    default:
      break;
  }

  const flagStyle = {
    visibility: visibility,
    color: color,
    padding: '2px',
    border: '2px solid ' + color,
    borderRadius: '50%',
  };

  return (
    //const elmPlayerToMove1 = <span id={'player-to-move'} className={["material-icons", "indicators-column"].join(' ')}>flag</span>;
    <span id='player-to-move' className='material-icons indicators-column' style={flagStyle}>flag</span>
  );
}

class Indicators extends Component {
  render() {
    return(
      <div id='indicators'>
        <OpponentType
          uiState={this.props.uiState}
          opponentKind={this.props.opponentKind}
          myColor={this.props.myColor}
          onOpponentTypeClick={this.props.onOpponentTypeClick}/>
        <Message uiState={this.props.uiState} blinkWinnerMessage={this.props.blinkWinnerMessage}/>
        <PlayerToMove uiState={this.props.uiState} turn={this.props.playerToMove}/>
      </div>
    );
  }
}

export default Indicators;
