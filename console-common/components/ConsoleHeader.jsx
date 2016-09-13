import i18n from 'i18next';
import store from 'store';
import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router';

function changeLanguage(lng) {
  return (e) => {
    e.preventDefault();

    i18n.changeLanguage(lng, () => {
      store.set('lng', lng);
      window.location.reload();
    });
  };
}

const C = (props) => {
  const { header } = props.context;
  const { auth, regionSet, serviceSet } = props.global;
  const { t, service, env } = props;

  if (header) {
    document.title = `${header.title} | ${env.appName}`;
  } else {
    document.title = `${env.appName}`;
  }

  return (
    <header className="header-expanded navbar navbar-fixed-top navbar-gitlab">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/asset/logo.white.svg" alt="logo" />
        </Link>
        <div className="header-content">
          <div className="navbar-left">
            <ul className="nav navbar-nav">
              {serviceSet && <li className="dropdown">
                <a href="javascript:void(0);" className="dropdown-toggle" role="button">
                  {t('productAndService')} <span className="caret"></span>
                </a>
                <ul className="dropdown-menu dropdown-menu-right">
                  {serviceSet.map((_service) => {
                    return <li key={_service.serviceKey}><a href={`/${_service.serviceKey}/`}>{t(`services.${_service.serviceKey}`)}</a></li>;
                  })}
                </ul>
              </li>}
            </ul>
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav pull-right">
              {regionSet && <li className="dropdown">
                <a href="javascript:void(0);" className="dropdown-toggle" role="button">
                  {service.region && <span><i className="fa fa-codepen"></i> {service.region.name}</span>}
                  {!service.region && <span><i className="fa fa-globe"></i> {t('globalRegion')}</span>}
                  &nbsp;<span className="caret"></span>
                </a>
                <ul className="dropdown-menu dropdown-menu-right">
                  {regionSet.map((_region) => {
                    if (service.serviceKey === 'g') {
                      return (
                        <li key={_region.regionId}>
                          <a href={`${_region.consoleEndpoint || ''}/`}>{_region.name}</a>
                        </li>
                      );
                    }

                    return (
                      <li key={_region.regionId}>
                        <a href={`${_region.consoleEndpoint || ''}/${service.serviceKey}/`}>
                          {_region.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>}
              <li>
                <a href="/g/#/tickets">
                  <i className="fa fa-ticket"></i>&nbsp;{t('ticket')}
                </a>
              </li>
              <li className="dropdown">
                <a href="javascript:void(0);" className="dropdown-toggle" role="button">
                  {auth.username} <span className="caret"></span>
                </a>
                <ul className="dropdown-menu dropdown-menu-right">
                  <li><a href="/g/#/profile">{t('profile')}</a></li>
                  <li><a href="/g/#/security">{t('security')}</a></li>
                  <li><a href="/g/#/access_keys">{t('sidebarAccessKey')}</a></li>
                  <li role="separator" className="divider"></li>
                  <li>
                    <Link className="logout" to="/logout">
                      <i className="fa fa-sign-out"></i> {t('logout')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="dropdown">
                <a href="javascript:void(0);" className="dropdown-toggle" role="button">
                  <i className="fa fa-language"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-right">
                  <li><a href onClick={changeLanguage('zh')}>{t('languages.chinese')}</a></li>
                  <li><a href onClick={changeLanguage('en')}>{t('languages.english')}</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
  env: React.PropTypes.object,
  global: React.PropTypes.object,
  region: React.PropTypes.object,
  service: React.PropTypes.object,
  context: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    env: state.env,
    global: state.global,
    region: state.region,
    service: state.service,
    context: state.context,
  };
}

export default connect(mapStateToProps)(translate(['common'], { wait: true })(C));
