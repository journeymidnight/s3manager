import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import LoadBalancerForm from '../forms/LoadBalancerForm';
import * as Actions from '../../console-common/redux/actions';
import * as LoadBalancerActions from '../redux/actions.load_balancer';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('loadbalancerManage'), `${servicePath}/load_balancers`));

    this.refresh();
  }

  refresh() {
    const { dispatch, region, routerKey } = this.props;

    dispatch(LoadBalancerActions.requestDescribeNetworks(routerKey, region.regionId, {
      status: ['active'],
      limit: 100,
      verbose: true,
    }));
  }


  onSubmit(values) {
    const { dispatch, region, routerKey, servicePath } = this.props;

    const name = values.name;
    const subnetId = values.subnetId;
    const bandwidth = Number(values.bandwidth);

    return new Promise((resolve, reject) => {
      dispatch(LoadBalancerActions.requestCreateLoadBalancer(routerKey, region.regionId, {
        name,
        subnetId,
        bandwidth,
      }))
        .then(() => {
          resolve();
          dispatch(push(`${servicePath}/load_balancers`));
        }).catch((error) => {
          dispatch(Actions.notifyAlert(error.displayMsg || error.message));
          reject();
        });
    });
  }

  render() {
    const { t } = this.props;
    const availableNetworks = this.props.context.networkSet || [];

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{t('createLoadBalancers')}</span>
              </div>
            </div>
            {availableNetworks.length > 0 && <LoadBalancerForm onSubmit={this.onSubmit} availableNetworks={availableNetworks} />}
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
