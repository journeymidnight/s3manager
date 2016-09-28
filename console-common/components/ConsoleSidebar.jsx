import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import update from 'react-addons-update';
import NavLink from '../../shared/components/NavLink';

class C extends React.Component {

  constructor() {
    super();
    this.state = {
      navStates: {},
    };

    this.toggleSubNavs = this.toggleSubNavs.bind(this);
  }

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
        path: 'monitors',
        title: t('resourceMonitors'),
        icon: 'fa-sticky-note',
        subNavs: [{
          path: 'monitors/usage',
          title: t('usageMonitor'),
          icon: 'fa-sticky-note',
        }, {
          path: 'monitors/flow',
          title: t('flowMonitor'),
          icon: 'fa-sticky-note',
        }, {
          path: 'monitors/api',
          title: t('apiMonitor'),
          icon: 'fa-sticky-note',
        }, {
          path: 'monitors/vendor',
          title: t('vendorMonitor'),
          icon: 'fa-sticky-note',
        }, {
          path: 'monitors/region',
          title: t('regionMonitor'),
          icon: 'fa-sticky-note',
        }],
      }],
    };

    const navStates = {};
    Object.keys(this.services).map((service) => {
      const navState = {};
      this.services[service].forEach((nav) => {
        if (nav.subNavs) navState[nav.title] = false;
      });
      navStates[service] = navState;
      return null;
    });

    this.setState({
      navStates,
    }, () => console.log(this.state));
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

  toggleSubNavs(navTitle) {
    if (this.state.navStates[this.props.service.serviceKey].hasOwnProperty([navTitle])) this.setState({
      navStates: update(this.state.navStates, {
        [this.props.service.serviceKey]: { [navTitle]: { $apply: (state) => !state } },
      }),
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
              <div key={_nav.path}>
                <NavLink
                  to={`${service.servicePath}/${_nav.path}`}
                  onClick={() => this.toggleSubNavs(_nav.title)}
                >
                  <i className={`fa ${_nav.icon} fa-fw`} />
                  <span>{_nav.title}</span>
                  {_nav.subNavs && !this.state.navStates[this.props.service.serviceKey][_nav.title] && <i className={`fa fa-angle-right`} style={{ marginLeft: '40px' }}/>}
                  {_nav.subNavs && this.state.navStates[this.props.service.serviceKey][_nav.title] && <i className={`fa fa-angle-down`} style={{ marginLeft: '40px' }}/>}
                </NavLink>

                {_nav.subNavs && this.state.navStates[service.serviceKey][_nav.title] && <ul className="nav sidebar-subnav">
                  {_nav.subNavs.map((_subNav) => {
                    return (
                      <NavLink
                        to={`${service.servicePath}/${_subNav.path}`}
                        key={_subNav.path}
                      >
                        <i className={`fa ${_subNav.icon} fa-fw`} />
                        <span>{_subNav.title}</span>
                      </NavLink>
                    );
                  })}
                </ul>}
              </div>
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
