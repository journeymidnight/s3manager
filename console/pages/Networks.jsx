import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Time from 'react-time';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import StatusFilter from '../../shared/components/StatusFilter';
import TimeSorter from '../../shared/components/TimeSorter';
import * as Actions from '../redux/actions';
import * as NetworkActions from '../redux/actions.network';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), `${servicePath}/networks`));

    this.initTable({
      status: ['pending', 'active'],
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return NetworkActions.requestDescribeNetworks(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { dispatch, routerKey, region } = this.props;
    const networkIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(NetworkActions.requestDeleteNetworks(routerKey, region.regionId, networkIds))
        .then(() => {
          resolve();
          this.onRefresh({}, false)();
        }).catch(() => {
          reject();
        });
    });
  }


  renderTable() {
    const { t, servicePath } = this.props;
    return this.props.context.total > 0 && this.props.context.networkSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.networkSet.map((u) => { return u.networkId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.networkSet.map((network) => {
            return (
              <tr key={network.networkId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(network.networkId)} checked={this.props.context.selected[network.networkId] === true} />
                </td>
                <td>
                  <Link to={`${servicePath}/networks/${network.networkId}`}>
                    {network.networkId}
                  </Link>
                </td>
                <td>
                  {network.name && <strong>{network.name}</strong>}
                  {!network.name && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td className={`i-status i-status-${network.status}`}>
                  <i className="icon"></i>
                  {t(`networkStatus.${network.status}`)}
                </td>
                <td><Time value={network.created} format="YYYY-MM-DD HH:mm:ss" /></td>
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
            {t('networkManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`${servicePath}/networks/create`}>
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
        status: ['pending', 'active'],
        name: t('allAvaliableStatus'),
      }, {
        status: ['active'],
        name: t('networkStatus.active'),
      }, {
        status: ['deleted', 'ceased'],
        name: t('networkStatus.deleted'),
      }];
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="filter-item inline labels-filter">
            <StatusFilter statusOption={statusOption} filterStatus={this.props.context.status} onRefresh={this.onRefresh} />
          </div>
          <div className="filter-item inline">
            <input type="search" ref="search" placeholder={t('filterByIdorName')} className="form-control" onKeyPress={this.onSearchKeyPress} />
          </div>
          <div className="pull-right">
            <TimeSorter isReverse={this.props.context.reverse} onRefresh={this.onRefresh} />
          </div>
        </div>
        <div className={Object.keys(this.props.context.selected).length > 0 ? '' : 'hidden'}>
          <div className="filter-item inline">
            <ButtonForm onSubmit={this.onDelete} text={t('delete')} type="btn-danger" />
          </div>
        </div>
      </div>
    );
  }

}

export default attach(C);
