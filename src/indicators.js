import './css/ReversiApp.css';
import React, { Component } from 'react';
import * as APP_CONST from './appConst';
import {PLAYER_LIGHT, PLAYER_DARK} from './model/position';
import * as GAME_CONST from './model/game';
//-------------------
import IconIndicator from './comps/iconIndicator';
import {withColorIcon, withClickIcon} from './comps/decoratedIcon';
//-------------------

const WhiteIcon = withColorIcon(IconIndicator, 'white');
const BlackIcon = withColorIcon(IconIndicator, 'black');

const playerPerson = 'person';
const playerComputer = 'computer';
const playerOpponentPerson = 'person_add';

class OpponentType extends Component
{
  constructor(props) {
    super(props);

    this.whitePlayerElement = this.PlayerElementFactory(PLAYER_LIGHT);
    this.blackPlayerElement = this.PlayerElementFactory(PLAYER_DARK);
  }

  CalculatePlayerIconText(playerColor) {
    let rv = '';

    if (APP_CONST.OPPONENT_KIND_ENGINE === this.props.opponentKind) {
      rv = (playerColor === this.props.myColor) ? playerPerson : playerComputer;
    } else {
      rv = (playerColor === this.props.myColor) ? playerPerson : playerOpponentPerson;
    }

    return rv;
  }

  IsEnabled() {
    let rv = true;

    switch (this.props.uiState) {
      case APP_CONST.UI_STATE_GAME_TO_START:
        break;
      case APP_CONST.UI_STATE_CANCELED:
        break;
      case APP_CONST.UI_STATE_END_OF_GAME:
        break;
      case APP_CONST.UI_STATE_PLAYING:
        rv = false;
        break;
      case APP_CONST.UI_STATE_PAUSE:
        rv = false;
        break;
      default:
        rv = false;
        break;
    }

    return rv;
  }

  PlayerElementFactory(playerColor) {
    let rv = undefined;

    const baseElem = (PLAYER_LIGHT === playerColor) ? WhiteIcon : BlackIcon;
    rv = withClickIcon(baseElem, this.IsEnabled(), this.props.onOpponentTypeClick);

    return rv;
  }

  render () {
    const whitePlayer = this.CalculatePlayerIconText(PLAYER_LIGHT);
    const blackPlayer = this.CalculatePlayerIconText(PLAYER_DARK);
    const enabled = this.IsEnabled();

    return (
      <div id={'opponent-type'} className={'indicators-column'}>
        <this.whitePlayerElement
          elementId={'lblPlayerWhite'}
          elementClass={'material-icons'}
          enabled={enabled}
          text={whitePlayer}/>
        <span id={'lblVs'} className={'material-icons'}>compare_arrows</span>
        <this.blackPlayerElement
          elementId={'lblPlayerBlack'}
          elementClass={'material-icons'}
          enabled={enabled}
          text={blackPlayer}/>
      </div>
    );
  }
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
