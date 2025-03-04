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
    const { t, auth } = this.props;
    if (auth.username !== 'u-root') {
      return ( 
        <div className="nicescroll sidebar-wrapper" tabIndex="0">
          <div className="header-logo">
            <Link to="/">
              <img src="/asset/logo.white.svg" alt="logo" />
            </Link>
            <Link className="gitlab-text-container-link" to="/">
              <div className="gitlab-text-container">
                <h3>{this.props.env.AppName}</h3>
              </div>
            </Link>
          </div>
          <ul className="nav nav-sidebar">
            <NavLink to="/access_keys">
              <i className="fa fa-key fa-fw" />
              <span>{'API秘钥'}</span>
            </NavLink>
            <NavLink to="/buckets">
              <i className="fa fa-codepen fa-fw" />
              <span>{"存储空间"}</span>
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
    } else {
      return ( 
        <div className="nicescroll sidebar-wrapper" tabIndex="0">
          <div className="header-logo">
            <Link to="/">
              <img src="/asset/logo.white.svg" alt="logo" />
            </Link>
            <Link className="gitlab-text-container-link" to="/">
              <div className="gitlab-text-container">
                <h5 style={{"marginLeft":"40px"}}>{'对象存储管理系统'}</h5>
              </div>
            </Link>
          </div>
          <ul className="nav nav-sidebar">
          <NavLink to="/regions">
            <i className="fa fa-codepen fa-fw" />
            <span>{t('sidebarRegion')}</span>
          </NavLink>
          <NavLink to="/services">
            <i className="fa fa-star fa-fw" />
            <span>{t('sidebarService')}</span>
          </NavLink>
            <NavLink to="/users">
              <i className="fa fa-user fa-fw" />
              <span>{t('sidebarUser')}</span>
            </NavLink>
            <NavLink to="/projects">
              <i className="fa fa-cube fa-fw" />
              <span>{t('sidebarProject')}</span>
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
