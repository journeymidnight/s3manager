import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../console-common/redux/actions';

class C extends React.Component {

  componentDidMount() {
    setTimeout(() => {
      const { dispatch } = this.props;
      dispatch(Actions.requestLogout());
    }, 300);
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  auth: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(C);
