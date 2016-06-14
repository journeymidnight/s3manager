import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';
import * as InstanceActions from '../redux/actions.instance';

class C extends RegionPage {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.isEnabled = this.isEnabled.bind(this);
    this.startInstance = this.startInstance.bind(this);
    this.stopInstance = this.stopInstance.bind(this);
    this.restartInstance = this.restartInstance.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `/${region.regionId}/instances`));

    this.setInterval(() => {
      this.refresh();
    }, 1000);
  }

  refresh() {
    const { dispatch, region, routerKey, params } = this.props;

    const instanceId = params.instanceId;
    dispatch(InstanceActions.requestDescribeInstance(routerKey, region.regionId, instanceId))
    .then(() => {
      this.instance = this.props.context.instance;
    });
  }

  isEnabled() {
    const { instance } = this.instance;
    return instance.status !== 'deleted' && instance.status !== 'ceased' && instance.status !== 'error';
  }

  startInstance(e) {
    e.preventDefault();

    const { dispatch, region, routerKey, params } = this.props;
    dispatch(InstanceActions.requestStartInstances(routerKey, region.regionId, [params.instanceId]));
  }

  stopInstance(e) {
    e.preventDefault();

    const { dispatch, region, routerKey, params } = this.props;
    dispatch(InstanceActions.requestStopInstances(routerKey, region.regionId, [params.instanceId]));
  }

  restartInstance(e) {
    e.preventDefault();

    const { dispatch, region, routerKey, params } = this.props;
    dispatch(InstanceActions.requestRestartInstances(routerKey, region.regionId, [params.instanceId]));
  }

  render() {
    const { t, region, params } = this.props;

    const instance = this.props.context.instance || this.instance;
    if (!instance || instance.instanceId !== params.instanceId) {
      this.refresh();

      return <div />;
    }

    let active = 'monitor';
    if (_.endsWith(this.props.location.pathname, 'console')) {
      active = 'console';
    } else if (_.endsWith(this.props.location.pathname, 'output')) {
      active = 'output';
    } else if (_.endsWith(this.props.location.pathname, 'monitor')) {
      active = 'monitor';
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                <i className="light">
                  {instance.instanceId}
                </i>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageInstance.basic')}
                    <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a href onClick={this.startInstance}>{t('pageInstance.startInstance')}</a></li>
                        <li><a href onClick={this.stopInstance}>{t('pageInstance.stopInstance')}</a></li>
                        <li><a href onClick={this.restartInstance}>{t('pageInstance.restartInstance')}</a></li>
                      </ul>
                    </div>
                  </div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td>{instance.instanceId}</td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                        {instance.name && <strong>{instance.name}</strong>}
                        {!instance.name && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('description')}</td>
                        <td>
                        {instance.description && <strong>{instance.description}</strong>}
                        {!instance.description && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('address')}</td>
                        <td>
                        {instance.address && <strong>{instance.address}</strong>}
                        {!instance.address && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${instance.status}`}>
                          <i className="icon"></i>
                          {t(`instanceStatus.${instance.status}`)}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td>{instance.created}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-8 tabs">
                <ul className="nav-links clearfix">
                  <li className={`pull-left ${(active === 'monitor') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/monitor`}>
                      {t('pageInstance.monitor')}
                    </Link>
                  </li>
                  <li className={`pull-left ${(active === 'output') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/output`}>
                      {t('pageInstance.output')}
                    </Link>
                  </li>
                  <li className={`pull-left ${(active === 'console') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/console`}>
                      {t('pageInstance.console')}
                    </Link>
                  </li>
                </ul>
                <div className="prepend-top-20">
                  {React.cloneElement(this.props.children, { instance })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
