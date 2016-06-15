import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router';

class C extends React.Component {
  componentDidMount() {
    const $ = require('jquery');

    $('.navbar-toggle').click(() => {
      $('.header-content .title').toggle();
      $('.header-content .navbar-collapse').toggle();
      $('.navbar-toggle').toggleClass('active');
    });
  }
  render() {
    const { t } = this.props;
    const { header } = this.props.context;
    return (
      <header className="header-expanded navbar navbar-fixed-top navbar-gitlab">
        <div className="container-fluid">
          <div className="header-content">
            <button className="navbar-toggle" type="button">
              <span className="sr-only">
                Toggle navigation
              </span>
              <i className="fa fa-bars">
              </i>
            </button>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav pull-right">
                <li>
                  <Link to="/profile">
                    <i className="fa fa-user fa-fw"></i>
                  </Link>
                </li>
                <li>
                  <Link className="logout" to="/logout">
                    <i className="fa fa-sign-out"></i>
                  </Link>
                </li>
              </ul>
            </div>
            <h1 className="title">
              <Link to="/">{t('boss')}</Link>
              {header && header.title && ' · '}
              {header && header.title &&
                <Link className="project-item-select-holder" to={header.link}>{header.title}</Link>
              }
            </h1>
          </div>
        </div>
      </header>
    );
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
  auth: React.PropTypes.object,
  context: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    context: state.context,
  };
}

export default connect(mapStateToProps)(translate()(C));
