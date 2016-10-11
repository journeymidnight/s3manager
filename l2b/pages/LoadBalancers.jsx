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
import * as LoadBalancerActions from '../redux/actions.load_balancer';

class C extends TablePage {

  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('loadbalancerManage'), `${servicePath}/load_balancers`));

    this.initTable(routerKey, {
      status: ['active', 'pending', 'building'],
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return LoadBalancerActions.requestDescribeLoadBalancers(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { t, dispatch, routerKey, region } = this.props;
    const loadbalancerIds = _.keys(this.props.context.selected);

    confirmModal(t('confirmDelete'), () => {
      return new Promise((resolve, reject) => {
        dispatch(LoadBalancerActions.requestDeleteLoadBalancers(routerKey, region.regionId, loadbalancerIds))
          .then(() => {
            resolve();
            this.onRefresh({}, false)();
          }).catch(() => {
            reject();
          });
      });
    });
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
            <th>{t('bandwidth')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.loadBalancerSet.map((loadbalancer) => {
            return (
              <tr key={loadbalancer.loadBalancerId}>
                <td>
                  <input
                    type="checkbox"
                    className="selected"
                    onChange={this.onSelect(loadbalancer.loadBalancerId)}
                    checked={this.props.context.selected[loadbalancer.loadBalancerId] === true}
                  />
                </td>
                <td>
                  <Link to={`${servicePath}/load_balancers/${loadbalancer.loadBalancerId}`}>
                    {loadbalancer.loadBalancerId}
                  </Link>
                </td>
                <td>
                  <span className="list-item-name">
                  {loadbalancer.name && <strong>{loadbalancer.name}</strong>}
                  {!loadbalancer.name && <i className="text-muted">{t('noName')}</i>}
                  </span>
                </td>
                <td>{loadbalancer.bandwidth}Mbps</td>
                <td className={`i-status i-status-${loadbalancer.status}`}>
                  <i className="icon"></i>
                  {t(`loadBalancerStatus.${loadbalancer.status}`)}
                </td>
                <td className="light"><Time value={loadbalancer.created} format="YYYY-MM-DD HH:mm:ss" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderHeader() {
    const { t, servicePath } = this.props;
    return (
      <div className="top-area">
        <div className="nav-text">
          <span className="light">
            {t('loadBalancersManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`${servicePath}/load_balancers/create`}>
            <i className="fa fa-plus"></i>&nbsp; {t('create')}
          </Link>
        </div>
      </div>
    );
  }

  renderFilters() {
    const { t } = this.props;
    const statusOption = [
      {
        status: ['active', 'pending', 'building'],
        name: t('allAvaliableStatus'),
      }, {
        status: ['active'],
        name: t('loadBalancerStatus.active'),
      }, {
        status: ['error'],
        name: t('loadBalancerStatus.error'),
      }, {
        status: ['deleted'],
        name: t('loadBalancerStatus.deleted'),
      }];
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.doSearch}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="filter-item inline labels-filter">
            <StatusFilter statusOption={statusOption} filterStatus={this.props.context.status} onRefresh={this.onRefresh} />
          </div>
          <div className="filter-item inline">
            <SearchBox ref="searchBox" placeholder={t('filterByIdorName')} onEnterPress={this.onSearchKeyPress} onButtonClick={this.onSearchButtonClick} />
          </div>
          <div className="pull-right">
            <TimeSorter isReverse={this.props.context.reverse} onRefresh={this.onRefresh} />
          </div>
        </div>
        <div className={Object.keys(this.props.context.selected).length > 0 ? '' : 'hidden'}>
          <div className="filter-item inline">
            <ButtonForm
              onSubmit={this.onDelete}
              text={t('delete')}
              type="btn-danger"
              disabled={this.isBatchActionDisabled(['active', 'error'], this.props.context.loadBalancerSet, 'loadBalancerId')}
            />
          </div>
        </div>
      </div>
    );
  }

}

export default attach(C);
