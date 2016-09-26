import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { attach } from '../../shared/pages/Page';
import Modal, { confirmModal } from '../../shared/components/Modal';
import { buttonForm } from '../../shared/forms/ButtonForm';
import TablePage from '../../shared/pages/TablePage';
import SubnetCreateForm from '../forms/SubnetCreateForm';
import TimeSorter from '../../shared/components/TimeSorter';
import SearchBox from '../../shared/components/SearchBox';
import * as Actions from '../../console-common/redux/actions';
import * as NetworkActions from '../redux/actions.network';


class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onCreateSubnet = this.onCreateSubnet.bind(this);
    this.showCreatePanel = this.showCreatePanel.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), `${servicePath}/networks`));

    this.initTable(routerKey, {
      status: ['active'],
      isTabPage: true,
    });
  }

  refreshAction(routerKey, filters) {
    const { region, network } = this.props;
    filters.networkIds = [network.networkId];
    return NetworkActions.requestDescribeSubnets(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { t } = this.props;

    confirmModal(t('confirmDelete'), () => {
      const { dispatch, region, routerKey } = this.props;
      const subnetIds = _.keys(this.props.context.selected);

      return new Promise((resolve, reject) => {
        dispatch(NetworkActions.requestDeleteSubnets(routerKey, region.regionId, subnetIds))
        .then(() => {
          resolve();
          this.onRefresh({}, false)();
        }).catch(() => {
          reject();
        });
      });
    });
  }

  onCreateSubnet(values) {
    const { dispatch, region, routerKey, network } = this.props;

    return new Promise((resolve, reject) => {
      const cidr = values.cidr;

      dispatch(NetworkActions.requestCreateSubnet(routerKey, region.regionId, {
        networkId: network.networkId,
        cidr,
      }))
        .then(() => {
          resolve();
          this.refs.subnetCreateModal.hide();
          this.onRefresh({}, false)();
        }).catch((error) => {
          dispatch(Actions.notifyAlert(error.displayMsg || error.message));
          reject();
        });
    });
  }

  showCreatePanel(e) {
    e.preventDefault();
    this.refs.subnetCreateModal.show();
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.subnetSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(this.props.context.subnetSet.map((u) => { return u.subnetId; }))}
                checked={this.isAllSelected(this.props.context.subnetSet.map((u) => { return u.subnetId; }))}
              />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('cidr')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.subnetSet.map((subnet) => {
          return (
            <tr key={subnet.subnetId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(subnet.subnetId)} checked={this.props.context.selected[subnet.subnetId] === true} />
              </td>
              <td>{subnet.subnetId}</td>
              <td>
                {subnet.cidr}
              </td>
              <td>{moment.utc(subnet.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }

  renderHeader() {
    const { t } = this.props;
    return (
      <div>
        <div className="top-area">
          <div className="nav-text">
            <span className="light">
              {t('subnetManageDescription')}
            </span>
          </div>
          <div className="nav-controls">
            <a className="btn btn-new" href onClick={this.showCreatePanel}>
              <i className="fa fa-plus"></i>&nbsp;{t('create')}
            </a>
          </div>
        </div>
        <Modal title={t('pageNetwork.createSubnet')} ref="subnetCreateModal" >
          <SubnetCreateForm onSubmit={this.onCreateSubnet} />
        </Modal>
      </div>
    );
  }

  renderFilters() {
    const { t } = this.props;
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.doSearch}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="filter-item inline">
            <SearchBox ref="searchBox" placeholder={t('filterByIdorCidr')} onEnterPress={this.onSearchKeyPress} onButtonClick={this.onSearchButtonClick} />
          </div>
          <div className="pull-right">
            <TimeSorter isReverse={this.props.context.reverse} onRefresh={this.onRefresh} />
          </div>
        </div>
        {Object.keys(this.props.context.selected).length > 0 && <div>
          <div className="filter-item inline">
            {buttonForm({
              onSubmit: this.onDelete,
              text: t('delete'),
              type: 'btn-danger',
              disabled: this.isBatchActionDisabled(['active'], this.props.context.subnetSet, 'subnetId'),
            })}
          </div>
        </div>}
      </div>
    );
  }
}

export default attach(C);
