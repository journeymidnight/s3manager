import React from 'react';
import { connect } from 'react-redux';
import ConsoleHeader from '../components/ConsoleHeader.jsx';
import ConsoleSidebar from '../components/ConsoleSidebar.jsx';

const App = (props) => (
  <div>
    <ConsoleHeader auth={props.auth} env={props.env} />
    <div className="page-sidebar-expanded page-with-sidebar">
      <ConsoleSidebar />
      <div className="content-wrapper">
        <div className="flash-container">
        </div>
        {props.children}
      </div>
    </div>
  </div>
);

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  children: React.PropTypes.element.isRequired,
  env: React.PropTypes.object.isRequired,
  auth: React.PropTypes.object,
  context: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    env: state.env,
    context: state.context,
  };
}

export default connect(mapStateToProps)(App);
