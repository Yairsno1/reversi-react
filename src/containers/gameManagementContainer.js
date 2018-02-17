import { connect } from 'react-redux'
import GameManagement from '../gameManagement';

const mapStateToProps = (state) => {
  return {
    uiState: state.uiState,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onPuseResume: () => {
      ownProps.onPuseResume(dispatch);
    },
    onCancel: () => {
      ownProps.onCancel(dispatch);
    },
  };
};

const GameManagementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameManagement);

export default GameManagementContainer;

