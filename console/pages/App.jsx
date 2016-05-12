import React from 'react';
import { connect } from 'react-redux';
import ConsoleHeader from '../components/ConsoleHeader.jsx';
import ConsoleSidebar from '../components/ConsoleSidebar.jsx';
import Notify from '../../shared/components/Notify.jsx';
import * as Actions from '../redux/actions';

class App extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(Actions.requestRegion('pek2'));
  }

  render() {
    const region = this.props.region;
    if (!region) {
      return <div />;
    }

    return (
      <div>
        <ConsoleHeader auth={this.props.auth} env={this.props.env} />
        <div className="page-sidebar-expanded page-with-sidebar">
          <ConsoleSidebar />
          <div className="content-wrapper">
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
  env: React.PropTypes.object.isRequired,
  auth: React.PropTypes.object,
  context: React.PropTypes.object,
  region: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    env: state.env,
    context: state.context,
    region: state.region,
  };
}

export default connect(mapStateToProps)(App);
