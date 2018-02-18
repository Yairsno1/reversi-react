import { connect } from 'react-redux'
import ScoreSheet from '../scoreSheet';

const mapStateToProps = (state) => {
  return {
    uiState: state.uiState,
    result: state.result,
    position: state.position,
    moves: state.moves,
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
