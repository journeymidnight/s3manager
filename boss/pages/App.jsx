import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ConsoleHeader from '../components/ConsoleHeader.jsx';
import ConsoleSidebar from '../components/ConsoleSidebar.jsx';
import Notify from '../../shared/components/Notify.jsx';

const App = (props) => {
  const { t } = props;

  return (
    <div>
      <ConsoleHeader auth={props.auth} env={props.env} />
      <div className="page-sidebar-expanded page-with-sidebar">
        <ConsoleSidebar />
        <div className="content-wrapper">
          <div className="visible-xs-block">
            <div className="flash-container">
              <div className="flash-warning">{t('smallScreen')}</div>
            </div>
          </div>
          <Notify />
          {props.children}
        </div>
      </div>
    </div>
  );
};

App.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  children: React.PropTypes.element.isRequired,
  t: React.PropTypes.any,
  env: React.PropTypes.object.isRequired,
  auth: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    env: state.env,
  };
}

export default connect(mapStateToProps)(translate()(App));
