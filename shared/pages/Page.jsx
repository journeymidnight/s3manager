import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

// this shoule be class
class C extends React.Component {
  componentDidMount() {
  }
  render() {
    return <div />;
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  context: React.PropTypes.object,
  t: React.PropTypes.any,
  routerKey: React.PropTypes.string,
};

function mapStateToProps(state) {
  return {
    context: state.context,
    routerKey: state.routing.locationBeforeTransitions.key,
  };
}

export function attach(page) {
  return connect(mapStateToProps)(translate()(page));
}

export default C;
