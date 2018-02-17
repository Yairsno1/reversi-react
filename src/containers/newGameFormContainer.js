import { connect } from 'react-redux'
import NewGameForm from '../newGameForm';

const mapStateToProps = (state) => {
  return {
    currOpponentKind: state.opponentKind,
    currMyColor: state.myColor,
    display: state.showNewGameForm,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClose: () => {
      ownProps.onClose(dispatch);
    },
    onGo: (whichOpponent, whichColor) => {
      ownProps.onGo(dispatch, whichOpponent, whichColor);
    },
  };
};

const NewGameFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewGameForm);

export default NewGameFormContainer;
