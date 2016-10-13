import moment from 'moment';
import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import Modal from '../../shared/components/Modal';
import * as Actions from '../../console-common/redux/actions';
import * as LoadBalancerActions from '../redux/actions.load_balancer';
import ListenerUpdateForm from '../forms/ListenerUpdateForm';


class LbListener extends Page {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.updateListener = this.updateListener.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('loadbalancerManage'), `${servicePath}/load_balancers`)); // TODO:

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

  onUpdate(values) {
    const { dispatch, region, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(LoadBalancerActions.requestModifyLoadBalancerListenerAttributes(routerKey, region.regionId, params.listenerId, name, description))
        .then(() => {
          resolve();
          this.refs.updateModal.hide();
          this.refresh();
        }).catch(() => {
          reject();
        });
    });
  }

  render() {
    const { t, params } = this.props;

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
            </div>

            <div className="row">
              <div className="col-md-12 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageLoadBalancer.basic')}
                    <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="btn-page-action"
                            onClick={this.updateListener}
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
                        <td>{t('id')}</td>
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
                        <td>{t('port')}</td>
                        <td>
                          <span>
                            {listener.port}
                          </span>
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
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${listener.status}`}>
                          <span>
                            <i className="icon"></i>
                            {t(`lblistenerStatus.${listener.status}`)}
                            <br />
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td><span>{moment.utc(listener.created).local().format('YYYY-MM-DD HH:mm:ss')}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal title={t('pageLoadBalancer.update')} ref="updateModal" >
          <ListenerUpdateForm onSubmit={this.onUpdate} initialValues={listener} />
        </Modal>
      </div>
    );
  }
} // TODO: side has to style

export default attach(LbListener);
