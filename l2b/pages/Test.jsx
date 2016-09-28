import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Time from 'react-time';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import { confirmModal } from '../../shared/components/Modal';
import StatusFilter from '../../shared/components/StatusFilter';
import TimeSorter from '../../shared/components/TimeSorter';
import SearchBox from '../../shared/components/SearchBox';
import * as Actions from '../../console-common/redux/actions';
import * as LoadbalanceActions from '../redux/actions.loadbalance';

class C extends TablePage {

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('loadbalancerManage'), `${servicePath}/loadbalancers`));

    this.initTable(routerKey, {
      status: ['active', 'pending', 'building'],
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return LoadbalanceActions.requestDescribeLoadBalancers(routerKey, region.regionId, filters);
  }

  renderTable() {
    const { t, servicePath } = this.props;
    return this.props.context.total > 0 && this.props.context.loadBalancerSet.length > 0 && (
      <table className="table table-list">
        <thead>
          <tr>
            <th width="40">
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(this.props.context.loadBalancerSet.map((u) => { return u.loadBalancerId; }))}
                checked={this.isAllSelected(this.props.context.loadBalancerSet.map((u) => { return u.loadBalancerId; }))}
              />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.loadBalancerSet.map((loadbalancer) => {
            return (
              <tr key={loadbalancer.loadBalancerId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(loadbalancer.loadBalancerId)} checked={this.props.context.selected[loadbalancer.loadBalancerId] === true} />
                </td>
                <td>
                  <Link to={`${servicePath}/loadbalancers/${loadbalancer.loadBalancerId}`}>
                    {loadbalancer.loadBalancerId}
                  </Link>
                </td>
                <td>
                  <span className="list-item-name">
                  {loadbalancer.name && <strong>{loadbalancer.name}</strong>}
                  {!loadbalancer.name && <i className="text-muted">{t('noName')}</i>}
                  </span>
                </td>
                <td className={`i-status i-status-${loadbalancer.status}`}>
                  <i className="icon"></i>
                  {t(`loadbalancerStatus.${loadbalancer.status}`)}
                </td>
                <td className="light"><Time value={loadbalancer.created} format="YYYY-MM-DD HH:mm:ss" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

}

export default attach(C);
