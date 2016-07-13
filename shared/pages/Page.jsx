import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

// this shoule be class
class C extends React.Component {

  constructor(props) {
    super(props);

    this.timers = [];
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props.context, nextProps.context) || !_.isEqual(this.state, nextState);
  }

  componentWillUnmount() {
    this.timers.forEach((timer) => {
      clearInterval(timer);
    });
  }

  setInterval(callback, interval) {
    const timer = setInterval(() => {
      callback();
    }, interval);

    this.timers.push(timer);
  }

  renderAfterInitialized() {
    return <div />;
  }

  render() {
    if (!this.props.context || !this.props.context.initialized) {
      return <div />;
    }

    return this.renderAfterInitialized();
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  context: React.PropTypes.object,
  region: React.PropTypes.object,
  service: React.PropTypes.object,
  servicePath: React.PropTypes.string,
  t: React.PropTypes.any,
  routerKey: React.PropTypes.string,
};

function mapStateToProps(state) {
  return {
    context: state.context,
    region: state.service && state.service.region,
    service: state.service,
    servicePath: state.service && state.service.servicePath,
    global: state.global,
    routerKey: state.routing.locationBeforeTransitions.key,
  };
}

export function attach(page) {
  return connect(mapStateToProps)(translate(['common'], { wait: true, withRef: true })(page));
}

export default C;
