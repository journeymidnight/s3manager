import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ConsoleHeader from '../components/ConsoleHeader.jsx';
import ConsoleSidebar from '../components/ConsoleSidebar.jsx';
import Notify from '../../shared/components/Notify.jsx';
import * as Actions from '../redux/actions';

class App extends React.Component {

  componentWillMount() {
    this.checkService(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkService(nextProps);
  }

  shouldComponentUpdate() {
    return true;
  }

  checkService(props) {
    const { routing, dispatch, service, global, params } = props;

    const currentService = routing.locationBeforeTransitions.pathname.split('/')[1];

    let currentRegion = params.regionId;
    if (!currentRegion) {
      if (global.defaultRegion) {
        currentRegion = global.defaultRegion.regionId;
      } else {
        currentRegion = undefined;
      }
    }

    this.currentService = currentService;

    if (!currentService) {
      return;
    }

    if (currentService === 'g') {
      if (!service || service.serviceKey !== currentService) {
        dispatch(Actions.selectService({
          serviceKey: 'g',
        }));
      }
    } else {
      if (!service) {
        dispatch(Actions.requestConnectService(currentService, currentRegion));
      } else if (service && service.serviceKey !== currentService) {
        dispatch(Actions.requestConnectService(currentService, currentRegion));
      }
    }
  }

  render() {
    const { t, service, children } = this.props;

    if (service && service.serviceKey !== this.currentService) {
      return <div />;
    }

    if (this.currentService && !service) {
      return <div />;
    }

    return (
      <div>
        <ConsoleHeader />
        <div className="page-sidebar-expanded page-with-sidebar">
          <ConsoleSidebar />
          <div className="content-wrapper">
            <div className="visible-xs-block">
              <div className="flash-container">
                <div className="flash-warning">{t('smallScreen')}</div>
              </div>
            </div>
            <Notify />
            {children}
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  children: React.PropTypes.element,
  params: React.PropTypes.object,
  global: React.PropTypes.object,
  service: React.PropTypes.object,
  routing: React.PropTypes.object,
  t: React.PropTypes.any,
};

function mapStateToProps(state) {
  return {
    service: state.service,
    routing: state.routing,
    global: state.global,
  };
}

export default connect(mapStateToProps)(translate()(App));
