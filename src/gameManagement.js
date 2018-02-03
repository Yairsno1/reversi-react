import React, { Component } from 'react';
import * as APP_CONST from './appConst';

const CAPTION_PAUSE = 'Pause';
const CAPTION_RESUME = 'Resume';

class GameManagement extends Component {
  render() {
    let gmbBtnDisabled = true; //The buttons pair disable status is identical.
    let pauseResumeCaption = CAPTION_PAUSE;

    switch (this.props.uiState) {
      case APP_CONST.UI_STATE_GAME_TO_START:
      //The UI state at startup is dictated by the HTML/CSS
        break;
      case APP_CONST.UI_STATE_CANCELED:
        pauseResumeCaption = CAPTION_PAUSE;
        gmbBtnDisabled = true;
        break;
      case APP_CONST.UI_STATE_END_OF_GAME:
        pauseResumeCaption = CAPTION_PAUSE;
        gmbBtnDisabled = true;
        break;
      case APP_CONST.UI_STATE_PLAYING:
        pauseResumeCaption = CAPTION_PAUSE;
        gmbBtnDisabled = false;
        break;
      case APP_CONST.UI_STATE_PAUSE:
        pauseResumeCaption = CAPTION_RESUME;
        gmbBtnDisabled = false;
        break;
      default:
        break;
    }

    return (
      <div id="game-management" className="column game-management-class">
        <div id="game-management-state" className="game-management-section">
          <button id="game-management-button-pause-resume" className="game-management-button"
            disabled={gmbBtnDisabled} onClick={this.props.onPuseResume}>
            {pauseResumeCaption}
          </button>
          <button id="game-management-button-cancel" className="game-management-button"
            disabled={gmbBtnDisabled} onClick={this.props.onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

export default GameManagement;
