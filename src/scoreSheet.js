import React, { Component } from 'react';
import * as APP_CONST from './appConst';
import * as GAME_CONST from './model/game';

function GameScore(props) {
  let score = '*';

  if (GAME_CONST.GAME_SCORE_WIN_LIGHT === props.result) {
    score = '1 - 0';
  } else if (GAME_CONST.GAME_SCORE_DRAW === props.result) {
    score = '1/2 - 1/2';
  } else if (GAME_CONST.GAME_SCORE_WIN_DARK === props.result) {
    score = '0 - 1';
  }

  return (
    <div id="score">{score}</div>
  );
}

function StoneScore(props) {
  return (
    <div id="stone-count-panel">
      <div id="stone-count-white" className="stone-count">{props.position.lightStonesCount}</div>
      <div id="stone-count-black" className="stone-count">{props.position.darkStonesCount}</div>
    </div>
  );
}

class Move extends Component {
  render () {
    const moveNo = this.props.number;
    // onclick="scoreSheet_clicked(1)"  onclick="scoreSheet_clicked(2)"


    if (this.props.ensureView) {
      APP_CONST.ScrollTableRowToView2(this.props.parent, this.blackCell); //APP_CONST.ScrollTableRowToView(moveNo);
    }

    return (
      <tr>
        <td className="move-no">{moveNo + '.'}</td>
        <td id={'move-w-' + moveNo}
          className="move-w"
          onClick={() => this.props.onWhiteCellClick((2*moveNo)-1)}>
          {this.props.white}
        </td>
        <td id={'move-b-' + moveNo}
          className="move-b"
          ref={(elem) => {this.blackCell = elem;}}
          onClick={() => this.props.onBlackCellClick(2*moveNo)}>
          {this.props.black}
        </td>
      </tr>
    );
  }
}

class MoveList extends Component {
  render () {
    const rows =  (() => {
      const moveCount = 30;
      let rv = new Array(moveCount);
      let i = 0;
      let whiteMove = '';
      let blackMove = '';
      let ensureView = false;

      for (i=0; i<moveCount; i ++)
      {
        whiteMove = 2*i < this.props.movesRecord.length ?
          this.props.movesRecord[2*i] : '';
        blackMove = (2*i)+1 < this.props.movesRecord.length ?
          this.props.movesRecord[(2*i)+1] : '';

        ensureView = false;
        if (APP_CONST.UI_STATE_PLAYING === this.props.uiState) {
          if (2*i === this.props.movesRecord.length-1 ||
            (2*i)+1 === this.props.movesRecord.length-1 ||
            (0 === i && 0 === this.props.movesRecord.length)) {
              ensureView = true;
          }
        }
        rv[i] = <Move key={'mv' + (i+1)} number={i+1}
          parent = {this.panel}
          white={whiteMove} black={blackMove}
          ensureView={ensureView}
          onWhiteCellClick={this.props.onCellClick}
          onBlackCellClick={this.props.onCellClick}/>
      }

      return rv;
    });

    return (
      <div id="move-list-panel" ref = {(elem) => {this.panel = elem;}}>
        <table id="move-list">
          <thead>
            <tr>
              <th id="header-move-no"></th>
              <th id="header-move-w">W </th>
              <th id="header-move-b">B </th>
            </tr>
          </thead>
          <tbody>
            {rows()}
          </tbody>
        </table>
      </div>
    );
  }
}

class ScoreSheet extends Component {
  render() {
    return (
      <div id="score-sheet" className="column score-sheet-class">
        <GameScore result={this.props.result}/>
        <StoneScore position={this.props.position.position}/>
        <MoveList
          uiState={this.props.uiState}
          movesRecord={this.props.moves}
          onCellClick={this.props.onCellClick}/>
      </div>
    );

  }
}

export default ScoreSheet;
