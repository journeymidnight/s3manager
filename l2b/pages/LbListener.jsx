import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import Modal from '../../shared/components/Modal';
import * as Actions from '../../console-common/redux/actions';
import * as LoadBalancerActions from '../redux/actions.load_balancer';
import UpdateForm from '../forms/UpdateForm';
// import LimitForm from '../forms/LimitForm';
import SessionForm from '../forms/SessionForm';
import HealthForm from '../forms/HealthForm';
import LbBackends from './LbBackends';

class LbListener extends Page {

  constructor() {
    super();

    this.state = {
      listenerList: false,
    };
    this.forwards = { ROUND_ROBIN: 'roundRobin' };

    this.refresh = this.refresh.bind(this);
    // this.updateLimit = this.updateLimit.bind(this);
    this.updateListener = this.updateListener.bind(this);
    this.updateSession = this.updateSession.bind(this);
    this.updateHealth = this.updateHealth.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    // this.onUpdateParams = this.onUpdateParams.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('loadbalancerManage'), `${servicePath}/load_balancers`));

    this.setInterval(() => {
      this.refresh();
    }, 2000);
  }

  refresh() {
    const { dispatch, region, routerKey, params } = this.props;
    const filters = {
      loadBalancerIds: [params.loadBalancerId],
      loadBalancerListenerIds: [params.listenerId],
    };
    dispatch(LoadBalancerActions.requestDescribeLbListeners(routerKey, region.regionId, filters))
      .then(() => {
        this.listener = this.props.context.listenerSet[0];
      });
  }

  updateListener() {
    this.refs.updateModal.show();
  }

  /* updateLimit() {
    this.refs.limitModal.show();
  }*/

  updateSession() {
    this.refs.sessionModal.show();
  }

  updateHealth() {
    this.refs.healthModal.show();
  }

  onUpdate(values) {
    const { dispatch, region, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(LoadBalancerActions.requestModifyLoadBalancerListener(routerKey, region.regionId, params.listenerId, name, description))
        .then(() => {
          resolve();
          this.refs.updateModal.hide();
          this.refresh();
        }).catch(() => {
          reject();
        });
    });
  }

  /* onUpdateParams(values) {
    const { dispatch, region, routerKey, params } = this.props;

    let listener = this.listener;
    if (this.props.context.listenerSet) {
      listener = this.props.context.listenerSet[0];
    }
    const { sessionPersistenceMode } = listener;

    return new Promise((resolve, reject) => {
      dispatch(LoadBalancerActions.requestUpdateLoadBalancerListener(routerKey, region.regionId, params.listenerId, Object.assign({}, { sessionPersistenceMode }, values)))
        .then(() => {
          resolve();
          this.refs.limitModal.hide();
          this.refs.sessionModal.hide();
          this.refs.healthModal.hide();
          this.refresh();
        })
        .catch(() => {
          reject();
        });
    });
  }*/

  render() {
    const { t, params, servicePath } = this.props;

    let listener = this.listener;
    if (this.props.context.listenerSet) {
      listener = this.props.context.listenerSet[0];
    }
    if (!listener || listener.loadBalancerListenerId !== params.listenerId) {
      this.refresh();

      return <div />;
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                <span>{t('pageLoadBalancer.listener')}&nbsp;<i>{listener.loadBalancerListenerId}</i></span>
              </div>

              <div className="nav-controls">
                <Link className="btn btn-primary" to={`${servicePath}/load_balancers/${params.loadBalancerId}/lb_listeners`}>
                  <i className="fa fa-reply"></i>&nbsp;{t('pageLoadBalancer.back')}
                </Link>

                <a
                  className="btn btn-primary"
                  href
                  onClick={e => {
                    e.preventDefault();
                    this.setState({ listenerList: !this.state.listenerList });
                  }}
                >
                  {this.state.listenerList ? <i className="fa fa-chevron-up"></i> : <i className="fa fa-chevron-down"></i>}
                  &nbsp;
                  {this.state.listenerList ? t('pageLoadBalancer.fold') : t('pageLoadBalancer.unfold')}
                </a>
              </div>
            </div>

            {this.state.listenerList && <div className="row">
              <div className="col-md-12 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageLoadBalancer.basic')}
                    <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu" style={{ left: 'auto', right: 0 }}>
                        <li>
                          <button
                            className="btn-page-action"
                            onClick={this.updateListener}
                          >
                            {t('pageLoadBalancer.update')}
                          </button>
                        </li>

                        {/* <li>
                          <button
                            className="btn-page-action"
                            onClick={this.updateLimit}
                          >
                            {t('pageLoadBalancer.changeLimit')}
                          </button>
                        </li>*/}
                      </ul>
                    </div>
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td style={{ width: '40%' }}>{t('id')}</td>
                        <td><span>{listener.loadBalancerListenerId}</span></td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                          <span>
                          {listener.name && <strong>{listener.name}</strong>}
                            {!listener.name && <i className="text-muted">{t('noName')}</i>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('description')}</td>
                        <td>
                          <span>{listener.description || <i className="text-muted">{t('noName')}</i>}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('protocol')}</td>
                        <td>
                          <span>
                            {listener.protocol}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('port')}</td>
                        <td>
                          <span>
                            {listener.port}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageLoadBalancer.forward')}</td>
                        <td>
                          <span>
                            {t(`pageLoadBalancer.${this.forwards[listener.balanceMode]}`)}
                          </span>
                        </td>
                      </tr>
                      {/* <tr>
                        <td>{t('pageLoadBalancer.connectionLimit')}</td>
                        <td><span>{listener.connectionLimit === -1 ? t('pageLoadBalancer.limitOff') : listener.connectionLimit}</span></td>
                      </tr>*/}
                      {/* <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${listener.status}`}>
                          <span>
                            <i className="icon"></i>
                            {t(`lblistenerStatus.${listener.status}`)}
                            <br />
                          </span>
                        </td>
                      </tr> */}
                      <tr>
                        <td>{t('created')}</td>
                        <td><span>{moment.utc(listener.created).local().format('YYYY-MM-DD HH:mm:ss')}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>}

            {this.state.listenerList && <div className="row">
              <div className="col-md-12 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageLoadBalancer.session')}
                    <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu" style={{ left: 'auto', right: 0 }}>
                        <li>
                          <button
                            className="btn-page-action"
                            onClick={this.updateSession}
                          >
                            {t('pageLoadBalancer.update')}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td style={{ width: '40%' }}>{t('pageLoadBalancer.sessionStatus')}</td>
                        <td><span>{listener.sessionPersistenceMode ? t('pageLoadBalancer.on') : t('pageLoadBalancer.off')}</span></td>
                      </tr>

                      {listener.sessionPersistenceMode && <tr>
                        <td>{t('pageLoadBalancer.sessionPersistenceMode')}</td>
                        <td><span>{listener.sessionPersistenceMode}</span></td>
                      </tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>}

            {this.state.listenerList && <div className="row">
              <div className="col-md-12 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageLoadBalancer.health')}
                    <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu" style={{ left: 'auto', right: 0 }}>
                        <li>
                          <button
                            className="btn-page-action"
                            onClick={this.updateHealth}
                          >
                            {t('pageLoadBalancer.update')}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td style={{ width: '40%' }}>{t('pageLoadBalancer.healthMonitorType')}</td>
                        <td><span>{listener.healthMonitorType}</span></td>
                      </tr>

                      <tr>
                        <td>{t('pageLoadBalancer.healthMonitorDelay')}</td>
                        <td><span>{listener.healthMonitorDelay}{t('pageLoadBalancer.second')}</span></td>
                      </tr>

                      <tr>
                        <td>{t('pageLoadBalancer.healthMonitorTimeout')}</td>
                        <td><span>{listener.healthMonitorTimeout}{t('pageLoadBalancer.second')}</span></td>
                      </tr>

                      <tr>
                        <td>{t('pageLoadBalancer.healthMonitorMaxRetries')}</td>
                        <td><span>{listener.healthMonitorMaxRetries}{t('pageLoadBalancer.count')}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>}
          </div>
        </div>

        <Modal title={t('pageLoadBalancer.update')} ref="updateModal" >
          <UpdateForm onSubmit={this.onUpdate} initialValues={listener} />
        </Modal>

        {/* <Modal title={t('pageLoadBalancer.connectionLimit')} ref="limitModal" >
          <LimitForm onSubmit={this.onUpdateParams} initialValues={listener} />
        </Modal>*/}

        <Modal title={t('pageLoadBalancer.session')} ref="sessionModal" >
          <SessionForm onSubmit={this.onUpdateParams} initialValues={Object.assign({}, listener, { session: listener.sessionPersistenceMode || false })} />
        </Modal>

        <Modal title={t('pageLoadBalancer.health')} ref="healthModal" >
          <HealthForm onSubmit={this.onUpdateParams} initialValues={listener} />
        </Modal>

        <LbBackends params={this.props.params} />
      </div>
    );
  }
} // TODO: side has to style

export default attach(LbListener);
