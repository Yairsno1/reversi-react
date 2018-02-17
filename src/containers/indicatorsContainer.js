import { connect } from 'react-redux'
import Indicators from '../indicators';

const mapStateToProps = (state) => {
  return {uiState: state.uiState,
    myColor: state.myColor,
    opponentKind: state.opponentKind,
    blinkWinnerMessage: state.blinkWinnerMessage,
    playerToMove: state.position.position.turn,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onOpponentTypeClick: () => {
      ownProps.onOpponentTypeClick(dispatch);
    }
  };
};

const IndicatorsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Indicators)

export default IndicatorsContainer;
