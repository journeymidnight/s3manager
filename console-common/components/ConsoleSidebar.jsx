import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import NavLink from '../../shared/components/NavLink';

class C extends React.Component {

  componentWillMount() {
    const { t } = this.props;

    this.services = {
      g: [{
        path: 'profile',
        title: t('profile'),
        icon: 'fa-cog',
      }, {
        path: 'security',
        title: t('security'),
        icon: 'fa-shield',
      }, {
        path: 'access_keys',
        title: t('sidebarAccessKey'),
        icon: 'fa-code',
      }, {
        path: 'tickets',
        title: t('ticket'),
        icon: 'fa-ticket',
      }],
      lcs: [{
        path: 'overview',
        title: t('sidebarUsage'),
        icon: 'fa-pie-chart',
      }, {
        path: 'instances',
        title: t('sidebarInstance'),
        icon: 'fa-server',
      }, {
        path: 'networks',
        title: t('sidebarNetwork'),
        icon: 'fa-exchange',
      }, {
        path: 'volumes',
        title: t('sidebarVolume'),
        icon: 'fa-hdd-o',
      }, {
        path: 'images_snapshots',
        title: t('sidebarImagesAndSnapshots'),
        icon: 'fa-certificate',
      }, {
        path: 'eips',
        title: t('sidebarEIP'),
        icon: 'fa-rocket',
      }, {
        path: 'key_pairs',
        title: t('sidebarKeyPair'),
        icon: 'fa-key',
      }, {
        path: 'activities',
        title: t('sidebarActivity'),
        icon: 'fa-sticky-note',
      }],
      los: [{
        path: 'buckets',
        title: t('bucketList'),
        icon: 'fa-sticky-note',
      }, {
        path: 'monitor',
        title: t('resourceMonitor'),
        icon: 'fa-sticky-note',
      }],
    };
  }

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
    const { t, service } = this.props;

    const serviceKey = service.serviceKey;
    const navs = this.services[serviceKey];

    return (
      <div className="nicescroll sidebar-wrapper" tabIndex="0">
        <div className="header-logo">
          <a href={`/${serviceKey}/`}>
            <img src="/asset/plato.white.svg" alt="logo" />
          </a>
          <a className="gitlab-text-container-link" href={`/${serviceKey}/`}>
            <div className="gitlab-text-container">
              <h3>{t(`services.${serviceKey}`)}</h3>
            </div>
          </a>
        </div>
        <ul className="nav nav-sidebar">
          {navs.map((_nav) => {
            return (
              <NavLink to={`${service.servicePath}/${_nav.path}`} key={_nav.path}>
                <i className={`fa ${_nav.icon} fa-fw`} />
                <span>{_nav.title}</span>
              </NavLink>
            );
          })}
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
  t: React.PropTypes.any,
  routing: React.PropTypes.object,
  service: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    routing: state.routing,
    service: state.service,
  };
}

export default connect(mapStateToProps)(translate(['common'], { wait: true })(C));
