import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Page from './Page';

// this shoule be class
class C extends Page {

  componentDidMount() {
  }

  componentWillUnmount() {
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  context: React.PropTypes.object,
  region: React.PropTypes.object,
  t: React.PropTypes.any,
  routerKey: React.PropTypes.string,
};

function mapStateToProps(state) {
  return {
    context: state.context,
    region: state.region,
    routerKey: state.routing.locationBeforeTransitions.key,
  };
}

export function attach(page) {
  return connect(mapStateToProps)(translate()(page));
}

export default C;
