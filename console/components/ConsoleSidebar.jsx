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
    const regionId = 'a' || this.props.region.regionId;
    return (
      <div className="nicescroll sidebar-wrapper" tabIndex="0">
        <div className="header-logo">
          <Link to="/">
            <img src="/asset/plato.white.svg" alt="logo" />
          </Link>
          <Link className="gitlab-text-container-link" to="/">
            <div className="gitlab-text-container">
              <h3>计算服务</h3>
            </div>
          </Link>
        </div>
        <ul className="nav nav-sidebar">
          <NavLink to={`/${regionId}/overview`}>
            <i className="fa fa-pie-chart fa-fw" />
            <span>{t('sidebarUsage')}</span>
          </NavLink>
          <NavLink to={`/${regionId}/instances`}>
            <i className="fa fa-server fa-fw" />
            <span>{t('sidebarInstance')}</span>
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
          <NavLink to={`/${regionId}/key_pairs`}>
            <i className="fa fa-key fa-fw" />
            <span>{t('sidebarKeyPair')}</span>
          </NavLink>
          <NavLink to={`/${regionId}/activities`}>
            <i className="fa fa-sticky-note fa-fw" />
            <span>{t('sidebarActivity')}</span>
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
  env: React.PropTypes.object,
  t: React.PropTypes.any,
  routing: React.PropTypes.object,
  region: React.PropTypes.object,
  service: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    env: state.env,
    routing: state.routing,
    region: state.region,
    service: state.service,
  };
}

export default connect(mapStateToProps)(translate()(C));
