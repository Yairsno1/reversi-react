import { connect } from 'react-redux'
import ScoreSheet from '../scoreSheet';

const mapStateToProps = (state) => {
  return {
    uiState: state.uiState,
    result: state.game.result,
    position: state.position,
    moves: state.game.moves,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCellClick: (ply) => {
      ownProps.onCellClick(dispatch, ply);
    },
  };
};

const ScoreSheetContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ScoreSheet);

export default ScoreSheetContainer;
