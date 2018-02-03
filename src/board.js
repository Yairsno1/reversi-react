import React, { Component } from 'react';
import {SQUARE_LIGHT, SQUARE_DARK} from './model/position';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const rowNums = [1, 2, 3, 4, 5, 6, 7, 8];

function Square(props) {
  const id = props.file + props.row;

  let bg = '';
  if (SQUARE_LIGHT === props.stone) {
    bg = 'url(images/whitestone.png), linear-gradient(darkgreen, limegreen)';
  } else if (SQUARE_DARK === props.stone) {
    bg = 'url(images/blackstone.png), linear-gradient(darkgreen, limegreen)';
  }

  let opacity = 1;
  if (props.moves.length > 0 && props.currMove !== '') {
    if (id === props.currMove) {
      opacity = 0.5;
    }
  }

  const style = {
    opacity: opacity,
    backgroundImage: bg,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };
  // onclick="square_clicked('a', 8)"
  return (
     <div id={id} className="square" style={style} onClick={props.onPlayerMove}></div>
  );
}

class Board extends Component {

  render() {
    const rows = rowNums.map((row) => {
      return files.map((file) => {
        return (
          <Square key={file+row}
            file={file} row={row}
            stone={this.props.position.position.getSquareByAlgebricNotation(file+row)}
            moves={this.props.moves}
            currMove={this.props.position.currMove}
            onPlayerMove={() => this.props.onMove(file, row)}/>
        );
      });
    });

    return (
      <div id='play-board' className='column play-board-class'>
        <div id='row8' className='board-row'>
          {rows[8-1]}
        </div>
        <div id='row7' className='board-row'>
          {rows[7-1]}
        </div>
        <div id='row6' className='board-row'>
          {rows[6-1]}
        </div>
        <div id='row5' className='board-row'>
          {rows[5-1]}
        </div>
        <div id='row4' className='board-row'>
          {rows[4-1]}
        </div>
        <div id='row3' className='board-row'>
          {rows[3-1]}
        </div>
        <div id='row2' className='board-row'>
          {rows[2-1]}
        </div>
        <div id='row1' className='board-row'>
          {rows[1-1]}
        </div>
      </div>
    );
  }
}

export default Board;
