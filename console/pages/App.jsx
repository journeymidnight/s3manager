import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ConsoleHeader from '../components/ConsoleHeader.jsx';
import ConsoleSidebar from '../components/ConsoleSidebar.jsx';
import Notify from '../../shared/components/Notify.jsx';
import Home from '../pages/Home';

class App extends React.Component {

  componentDidMount() {
  }

  render() {
    const { t, region, params } = this.props;
    if (!region) {
      return <Home params={this.props.params} />;
    } else if (params.regionId && region.regionId !== params.regionId) {
      return <Home params={this.props.params} />;
    }

    return (
      <div>
        <ConsoleHeader auth={this.props.auth} env={this.props.env} />
        <div className="page-sidebar-expanded page-with-sidebar">
          <ConsoleSidebar />
          <div className="content-wrapper">
            <div className="visible-xs-block">
              <div className="flash-container">
                <div className="flash-warning">{t('smallScreen')}</div>
              </div>
            </div>
            <Notify />
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  children: React.PropTypes.element.isRequired,
  auth: React.PropTypes.object,
  env: React.PropTypes.object.isRequired,
  context: React.PropTypes.object,
  t: React.PropTypes.any,
  routing: React.PropTypes.object,
  region: React.PropTypes.object,
  params: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    env: state.env,
    context: state.context,
    routing: state.routing,
    region: state.region,
  };
}

export default connect(mapStateToProps)(translate()(App));
