import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router';

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
                <a href="#" className="dropdown-toggle" role="button">
                  产品和服务 <span className="caret"></span>
                </a>
                <ul className="dropdown-menu dropdown-menu-right">
                  {serviceSet.map((_service) => {
                    return <li key={_service.serviceKey}><Link to={`/${_service.serviceKey}`}>{t(`services.${_service.serviceKey}`)}</Link></li>;
                  })}
                </ul>
              </li>}
            </ul>
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav pull-right">
              <li>
                <Link to="/g/tickets">
                  <i className="fa fa-ticket"></i>&nbsp;{t('ticket')}
                </Link>
              </li>
              {regionSet && <li className="dropdown">
                <a href="#" className="dropdown-toggle" role="button">
                  <i className="fa fa-codepen"></i>&nbsp;
                  {service && service.region && service.region.name || t('globalRegion')} <span className="caret"></span>
                </a>
                <ul className="dropdown-menu dropdown-menu-right">
                  {regionSet.map((_region) => {
                    return <li key={_region.regionId}><Link to={`${_region.consoleEndpoint || ''}/${(service && service.serviceKey) || ''}`}>{_region.name}</Link></li>;
                  })}
                </ul>
              </li>}
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" role="button">
                  {auth.username} <span className="caret"></span>
                </a>
                <ul className="dropdown-menu dropdown-menu-right">
                  <li><Link to="/g/profile">{t('profile')}</Link></li>
                  <li><Link to="/g/security">{t('security')}</Link></li>
                  <li role="separator" className="divider"></li>
                  <li>
                    <Link className="logout" to="/logout">
                      <i className="fa fa-sign-out"></i> {t('logout')}
                    </Link>
                  </li>
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

export default connect(mapStateToProps)(translate()(C));
