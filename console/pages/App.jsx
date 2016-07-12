import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ConsoleHeader from '../components/ConsoleHeader.jsx';
import ConsoleSidebar from '../components/ConsoleSidebar.jsx';
import Notify from '../../shared/components/Notify.jsx';

const App = (props) => {
  const { t, children } = props;
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
};

App.propTypes = {
  children: React.PropTypes.element,
  global: React.PropTypes.object,
  t: React.PropTypes.any,
};

function mapStateToProps(state) {
  return {
    global: state.global,
  };
}

export default connect(mapStateToProps)(translate()(App));
