import { connect } from "react-redux";
import { currentUserSet } from "../actions";

const mapDispatchToProps = (dispatch) => ({
  setUser: (text) => {
    dispatch(currentUserSet(text));
  },
});

const mapStateToProps = (state) => ({
  user: state.currentUser ? state.currentUser : null,
});

export default connect(mapStateToProps, mapDispatchToProps);
