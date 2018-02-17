import { connect } from 'react-redux'
import Board from '../board';

const mapStateToProps = (state) => {
  return {
    position: state.position,
    moves: state.game.moves,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onMove: (file, row) => {
      ownProps.onMove(dispatch, file, row);
    },
  };
};

const BoardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);

export default BoardContainer;
