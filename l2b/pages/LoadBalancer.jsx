import moment from 'moment';
import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../../console-common/redux/actions';
import * as LoadBalancerActions from '../redux/actions.load_balancer';


class C extends Page {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
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


  render() {
    const { t, params, servicePath } = this.props;

    const loadBalancer = this.props.context.loadBalancer || this.loadBalancer;
    if (!loadBalancer || loadBalancer.loadBalancerId !== params.loadBalancerId) {
      this.refresh();

      return <div />;
    }

    let active = 'lb_listeners';
    if (_.endsWith(this.props.location.pathname, 'lb_listeners')) {
      active = 'lb_listeners';
    } else if (_.endsWith(this.props.location.pathname, 'lb_backends')) {
      active = 'lb_backends';
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
                            onClick={this.updateLoadBalancer}
                          >
                            {t('pageLoadBalancer.updateLoadBalancer')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={loadBalancer.status !== 'active'}
                            onClick={this.deleteLoadBalancer}
                          >
                            {t('pageLoadBalancer.deleteLoadBalancer')}
                          </button>
                        </li>
                      </ul>
                    </div>}
                    {!this.isEnabled(loadBalancer) && this.isDeletable(loadBalancer) && <div className="btn-group pull-right">
                      <button type="button" className="btn" onClick={this.deleteLoadBalancer}>
                        {t('pageLoadBalancer.deleteLoadBalancer')}
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
                  <li className={`pull-left ${(active === 'lb_backends') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`${servicePath}/load_balancers/${loadBalancer.loadBalancerId}/lb_backends`}>
                      {t('pageLoadBalancer.backend')}
                    </Link>
                  </li>
                </ul>
                <div>
                  {React.cloneElement(this.props.children, { loadBalancer })}
                </div>
              </div>}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
