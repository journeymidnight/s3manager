import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import NavLink from '../../shared/components/NavLink';

class C extends React.Component {
  componentDidMount() {
    const $ = require('jquery');

    $('.nicescroll')
    .niceScroll({
      cursoropacitymax: '0.4',
      cursorcolor: '#fff',
      cursorborder: '1px solid #fff',
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div className="nicescroll sidebar-expanded sidebar-wrapper" tabIndex="0">
        <div className="header-logo">
          <Link to="/">
            <img width="32" height="32" src="/asset/logo.svg" alt="logo" />
          </Link>
          <Link className="gitlab-text-container-link" to="/">
            <div className="gitlab-text-container">
              <h3>{this.props.env.appName}</h3>
            </div>
          </Link>
        </div>
        <ul className="nav nav-sidebar">
          <li className="hidden">
            <a className="back-link" href="/groups/lestack">
              <i className="fa fa-caret-square-o-left fa-fw">
              </i>
              <span>
                Go to group
              </span>
            </a>
          </li>
          <NavLink to="/regions">
            <i className="fa fa-codepen fa-fw" />
            <span>{t('sidebarRegion')}</span>
          </NavLink>
          <NavLink to="/tenants">
            <i className="fa fa-cube fa-fw" />
            <span>{t('sidebarTenant')}</span>
          </NavLink>
          <NavLink to="/users">
            <i className="fa fa-user fa-fw" />
            <span>{t('sidebarUser')}</span>
          </NavLink>
          <li className="separate-item" />
          <NavLink to="/admins">
            <i className="fa fa-meh-o fa-fw" />
            <span>{t('sidebarAdmin')}</span>
          </NavLink>
        </ul>
        <div className="collapse-nav">
          <a className="toggle-nav-collapse" href="#">
            <i className="fa fa-angle-left">
            </i>
          </a>
        </div>
      </div>
    );
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  auth: React.PropTypes.object,
  env: React.PropTypes.object,
  t: React.PropTypes.any,
  routing: React.PropTypes.object,
};

function mapStateToProps(store) {
  return {
    auth: store.auth,
    env: store.env,
    routing: store.routing,
  };
}

export default connect(mapStateToProps)(translate()(C));
