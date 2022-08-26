import { connect } from "react-redux";
import { selectedRoomSet } from "../actions";

const mapDispatchToProps = (dispatch) => ({
  setSelectedRoom: (text) => {
    dispatch(selectedRoomSet(text));
  },
});

const mapStateToProps = (state) => ({
  selectedRoom: state.selectedRoom ? state.selectedRoom : {},
});

export default connect(mapStateToProps, mapDispatchToProps);
