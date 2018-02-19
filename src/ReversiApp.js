import './css/ReversiApp.css';
import './css/frmNewGame.css';
import React, { Component } from 'react';

import IndicatorsContainer from './containers/indicatorsContainer';
import GameManagementContainer from './containers/gameManagementContainer';
import BoardContainer from './containers/boardContainer';
import ScoreSheetContainer from './containers/scoreSheetContainer';
import NewGameFormContainer from './containers/newGameFormContainer';

class ReversiApp extends Component {
  render() {
    const ehs = this.props.eventHandlers;
    return (
      <div>
        <NewGameFormContainer
          onClose={ehs.newGameFormClose}
          onGo={ehs.newGameFormGo}
        />
        <div>
          <IndicatorsContainer
            onOpponentTypeClick={ehs.newGameFormShow}
          />
        </div>
        <div className="page-row">
          <GameManagementContainer
            onPuseResume={ehs.puaseResume}
            onCancel={ehs.cancel}
          />
          <BoardContainer
            onMove={ehs.squareClick}
          />
          <ScoreSheetContainer
            onCellClick={ehs.sheetCellClick}
          />
        </div>
      </div>
    );
  }
}

export default ReversiApp;
