import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

class C extends React.Component {

  initialize() {
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
  context: React.PropTypes.object,
  t: React.PropTypes.any,
};

function mapStateToProps(state) {
  return {
    context: state.context,
  };
}

export default connect(mapStateToProps)(translate()(C));
