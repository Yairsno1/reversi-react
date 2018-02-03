import React, { Component } from 'react';
import * as APP_CONST from './appConst';
import {PLAYER_LIGHT, PLAYER_DARK} from './model/position';

const rbSelectedGraphic = '3px 6px 10px navy inset';
const rbUnselectedGraphic = 'none';

class NewGameForm extends Component {
  constructor(props) {
    super(props);

    this.handleOpponentKindSelected = this.handleOpponentKindSelected.bind(this);
    this.handleMyColorSelected = this.handleMyColorSelected.bind(this);

    this.state = ({
      opponentKind: this.props.currOpponentKind,
      yourColor: this.props.currMyColor,
    });
  }

  handleOpponentKindSelected(option, event) {
    this.setState({
      opponentKind: option,
    });
  }

  handleMyColorSelected(option, event) {
    this.setState({
      yourColor: option,
    });
  }

  render () {
    const modalFormStyle = {
      display: (this.props.display ? 'block' : 'none'),
    };

    const opponentEngineStyle = {
      width: '35%',
      boxShadow: APP_CONST.OPPONENT_KIND_ENGINE === this.state.opponentKind ?
        rbSelectedGraphic : rbUnselectedGraphic,
    };
    const opponentPlayerStyle = {
      width: '35%',
      boxShadow: APP_CONST.OPPONENT_KIND_PLAYER === this.state.opponentKind ?
        rbSelectedGraphic : rbUnselectedGraphic,
    };

    const ColorWhiteStyle = {
      boxShadow: PLAYER_LIGHT === this.state.yourColor ?
        rbSelectedGraphic : rbUnselectedGraphic,
    }

    const ColorBlackStyle = {
      boxShadow: PLAYER_DARK === this.state.yourColor ?
        rbSelectedGraphic : rbUnselectedGraphic,
    }

    const goStyle = {
      width: '20%',
    };

    return (
      <div id="frm-new-game-back" className="modal" style={modalFormStyle}>
        <div id="pnl-new-game">

          <span id="btn-close-frm" className="material-icons" onClick={this.props.onClose}>clear</span>
          <div className="select-label">Play against</div>

          <div id="pnlOpponentKind">
            <div className="opponent-kind">
              <img id="imgEngine"
                src="./images/machine.png" alt="Engine"
                style={opponentEngineStyle}
                onClick={(e) => this.handleOpponentKindSelected(APP_CONST.OPPONENT_KIND_ENGINE, e)}/>
              <span className="tooltiptext">Play against the machine</span>
            </div>
            <div id="opponent-kind-player" className="opponent-kind">
              <img id="imgPlayer"
                src="./images/player.png" alt="Other player"
                style={opponentPlayerStyle}
                onClick={(e) => this.handleOpponentKindSelected(APP_CONST.OPPONENT_KIND_PLAYER, e)}/>
              <span className="tooltiptext">Play against other player</span>
            </div>
          </div>

          <div id="pnlYourColor">
            <div id="lblYourColor" className="select-label">Select your color</div>
            <div id="divYourColorWhite" className="your-color" style={ColorWhiteStyle}>
              <div id="rectWhite" className="player-color" onClick={(e) => this.handleMyColorSelected(PLAYER_LIGHT, e)}></div>
              <span className="tooltiptext">Play as white</span>
            </div>
            <div id="divYourColorBlack" className="your-color"  style={ColorBlackStyle}>
              <div id="rectBlack" className="player-color" onClick={(e) => this.handleMyColorSelected(PLAYER_DARK ,e)}></div>
              <span className="tooltiptext">Play as black</span>
            </div>
          </div>

          <div id="pnlGo">
            <div>
              <img src="./images/go.png" alt="Go"
                style={goStyle}
                onClick={() => this.props.onGo(this.state.opponentKind, this.state.yourColor)}/>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default NewGameForm;
