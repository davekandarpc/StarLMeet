import {connect} from 'react-redux';
import {notificationPush} from '../redux/actions';

const mapDispatchToProps = dispatch => ({
  toast: text => {
    dispatch(notificationPush(text));
  },
});

export default connect(null, mapDispatchToProps);
