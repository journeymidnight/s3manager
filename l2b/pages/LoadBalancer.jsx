import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import Modal, { confirmModal } from '../../shared/components/Modal';
import * as Actions from '../../console-common/redux/actions';
import * as LoadBalancerActions from '../redux/actions.load_balancer';
import UpdateForm from '../forms/UpdateForm';
import BandwidthForm from '../forms/BandwidthForm';

class C extends Page {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.update = this.update.bind(this);
    this.changeBandwidth = this.changeBandwidth.bind(this);
    this.onChangeBandwidth = this.onChangeBandwidth.bind(this);
    this.onDelete = this.onDelete.bind(this);
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

    const loadBalancerId = params.loadBalancerId;
    dispatch(LoadBalancerActions.requestDescribeLoadBalancer(routerKey, region.regionId, loadBalancerId))
    .then(() => {
      this.loadBalancer = this.props.context.loadBalancer;
    });
  }

  isEnabled(loadBalancer) {
    return loadBalancer.status !== 'deleted' && loadBalancer.status !== 'ceased' && loadBalancer.status !== 'error';
  }

  isDeletable(loadBalancer) {
    return loadBalancer.status !== 'deleted' && loadBalancer.status !== 'ceased';
  }

  onUpdate() {
    this.refs.updateModal.show();
  }

  update(values) {
    const { dispatch, region, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(LoadBalancerActions.requestModifyLoadBalancer(routerKey, region.regionId, params.loadBalancerId, name, description))
        .then(() => {
          resolve();
          this.refs.updateModal.hide();
          this.refresh();
        })
        .catch(() => {
          reject();
        });
    });
  }

  onChangeBandwidth() {
    this.refs.bandwidthModal.show();
  }

  changeBandwidth(values) {
    const { dispatch, region, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      dispatch(LoadBalancerActions.requestUpdateLoadBalancerBandwidth(routerKey, region.regionId, params.loadBalancerId, values.bandwidth))
        .then(() => {
          resolve();
          this.refs.bandwidthModal.hide();
          this.refresh();
        })
        .catch(() => {
          reject();
        });
    });
  }

  onDelete() {
    const { t, dispatch, routerKey, region, context } = this.props;
    const loadbalancerIds = [context.loadBalancer.loadBalancerId];

    confirmModal(t('confirmDelete'), () => {
      return new Promise((resolve, reject) => {
        dispatch(LoadBalancerActions.requestDeleteLoadBalancers(routerKey, region.regionId, loadbalancerIds))
          .then(() => {
            resolve();
            this.onRefresh({}, false)();
          })
          .catch(() => {
            reject();
          });
      });
    });
  }

  render() {
    const { t, params, servicePath } = this.props;

    const loadBalancer = this.props.context.loadBalancer || this.loadBalancer;
    if (!loadBalancer || loadBalancer.loadBalancerId !== params.loadBalancerId) {
      this.refresh();

      return <div />;
    }

    let active = 'lb_listeners';
    if (this.props.location.pathname.endsWith('lb_listeners')) {
      active = 'lb_listeners'; // TODO:
    } else if (this.props.location.pathname.endsWith('lb_monitors')) {
      active = 'lb_monitors';
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                <span>{t('load_balancer')}&nbsp;<i>{loadBalancer.loadBalancerId}</i></span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageLoadBalancer.basic')}
                    {this.isEnabled(loadBalancer) && <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={loadBalancer.status !== 'active'}
                            onClick={this.onUpdate}
                          >
                            {t('pageLoadBalancer.update')}
                          </button>
                        </li>

                        <li>
                          <button
                            className="btn-page-action"
                            disabled={loadBalancer.status !== 'active'}
                            onClick={this.onChangeBandwidth}
                          >
                            {t('pageLoadBalancer.changeBandwidth')}
                          </button>
                        </li>

                        <li>
                          <button
                            className="btn-page-action"
                            disabled={loadBalancer.status !== 'active'}
                            onClick={this.onDelete}
                          >
                            {t('pageLoadBalancer.delete')}
                          </button>
                        </li>
                      </ul>
                    </div>}
                    {!this.isEnabled(loadBalancer) && this.isDeletable(loadBalancer) && <div className="btn-group pull-right">
                      <button type="button" className="btn" onClick={this.onDelete}>
                        {t('pageLoadBalancer.delete')}
                      </button>
                    </div>}
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td><span>{loadBalancer.loadBalancerId}</span></td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                          <span>
                          {loadBalancer.name && <strong>{loadBalancer.name}</strong>}
                          {!loadBalancer.name && <i className="text-muted">{t('noName')}</i>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('description')}</td>
                        <td>
                          <span>{loadBalancer.description || <i className="text-muted">{t('noName')}</i>}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('subnet')}</td>
                        <td>
                          <span>
                            {loadBalancer.subnet_id}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('bandwidth')}</td>
                        <td>
                          <span>
                            {loadBalancer.bandwidth}Mbps
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${loadBalancer.status}`}>
                          <span>
                            <i className="icon"></i>
                            {t(`loadBalancerStatus.${loadBalancer.status}`)}
                            <br />
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('address')}</td>
                        <td>
                          <span>
                            {loadBalancer.address}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td><span>{moment.utc(loadBalancer.created).local().format('YYYY-MM-DD HH:mm:ss')}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {this.isEnabled(loadBalancer) && <div className="col-md-8 tabs">
                <ul className="nav-links clearfix">
                  <li className={`pull-left ${(active === 'lb_listeners') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`${servicePath}/load_balancers/${loadBalancer.loadBalancerId}/lb_listeners`}>
                      {t('pageLoadBalancer.listener')}
                    </Link>
                  </li>
                  {/* <li className={`pull-left ${(active === 'lb_monitors') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`${servicePath}/load_balancers/${loadBalancer.loadBalancerId}/lb_monitors`}>
                      {t('pageLoadBalancer.monitors')}
                    </Link>
                  </li>*/}
                </ul>
                <div>
                  {React.cloneElement(this.props.children, { loadBalancer })}
                </div>
              </div>}
            </div>

          </div>
        </div>

        <Modal title={t('pageLoadBalancer.update')} ref="updateModal" >
          <UpdateForm onSubmit={this.update} initialValues={loadBalancer} />
        </Modal>

        <Modal title={t('pageLoadBalancer.changeBandwidth')} ref="bandwidthModal" >
          <BandwidthForm onSubmit={this.changeBandwidth} initialValues={loadBalancer} />
        </Modal>
      </div>
    );
  }
}

export default attach(C);
