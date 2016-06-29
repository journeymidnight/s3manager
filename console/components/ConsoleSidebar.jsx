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
    const regionId = this.props.region.regionId;
    const regionName = this.props.region.name;
    return (
      <div className="nicescroll sidebar-wrapper" tabIndex="0">
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
          <li>
            <h5>{regionName}</h5>
          </li>
          <NavLink to={`/${regionId}/instances`}>
            <i className="fa fa-server fa-fw" />
            <span>{t('sidebarInstance')}</span>
          </NavLink>
          <NavLink to={`/${regionId}/instance_types`}>
            <i className="fa fa-cogs fa-fw" />
            <span>{t('sidebarInstanceType')}</span>
          </NavLink>
          <NavLink to={`/${regionId}/volumes`}>
            <i className="fa fa-hdd-o fa-fw" />
            <span>{t('sidebarVolume')}</span>
          </NavLink>
          <NavLink to={`/${regionId}/networks`}>
            <i className="fa fa-exchange fa-fw" />
            <span>{t('sidebarNetwork')}</span>
          </NavLink>
          <NavLink to={`/${regionId}/images_snapshots`}>
            <i className="fa fa-certificate fa-fw" />
            <span>{t('sidebarImagesAndSnapshots')}</span>
          </NavLink>
          <NavLink to={`/${regionId}/eips`}>
            <i className="fa fa-rocket fa-fw" />
            <span>{t('sidebarEIP')}</span>
          </NavLink>
          <NavLink to={`/${regionId}/images`}>
            <i className="fa fa-file-image-o fa-fw" />
            <span>{t('sidebarIMAGE')}</span>
          </NavLink>
          <NavLink to={`/${regionId}/key_pairs`}>
            <i className="fa fa-key fa-fw" />
            <span>{t('sidebarKeyPair')}</span>
          </NavLink>
          <NavLink to={`/${regionId}/firewalls`}>
            <i className="fa fa-shield fa-fw" />
            <span>{t('sidebarFirewall')}</span>
          </NavLink>
          <li className="separate-item" />
          <li>
            <h5>Global</h5>
          </li>
          <NavLink to="/access_keys">
            <i className="fa fa-code fa-fw" />
            <span>{t('sidebarAccessKey')}</span>
          </NavLink>
          <NavLink to="/activities">
            <i className="fa fa-sticky-note fa-fw" />
            <span>{t('sidebarActivity')}</span>
          </NavLink>
          <NavLink to="/usage">
            <i className="fa fa-pie-chart fa-fw" />
            <span>{t('sidebarUsage')}</span>
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
  region: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    env: state.env,
    routing: state.routing,
    region: state.region,
  };
}

export default connect(mapStateToProps)(translate()(C));
