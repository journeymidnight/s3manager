import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { attach } from '../../shared/pages/Page';
import Modal, { confirmModal } from '../../shared/components/Modal';
import { buttonForm } from '../../shared/forms/ButtonForm';
import TablePage from '../../shared/pages/TablePage';
import TimeSorter from '../../shared/components/TimeSorter';
import SearchBox from '../../shared/components/SearchBox';
import PortForwardingCreateForm from '../forms/PortForwardingCreateForm';
import * as Actions from '../../console-common/redux/actions';
import * as NetworkActions from '../redux/actions.network';


class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onCreatePortForwarding = this.onCreatePortForwarding.bind(this);
    this.createPortForwarding = this.createPortForwarding.bind(this);
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
    return NetworkActions.requestDescribePortForwardings(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { t } = this.props;

    confirmModal(t('confirmDelete'), () => {
      const { dispatch, region, routerKey } = this.props;
      const portForwardingIds = _.keys(this.props.context.selected);

      return new Promise((resolve, reject) => {
        dispatch(NetworkActions.requestDeletePortForwardings(routerKey, region.regionId, portForwardingIds))
        .then(() => {
          resolve();
          this.onRefresh({}, false)();
        }).catch((error) => {
          dispatch(Actions.notifyAlert(error.displayMsg || error.message));
          reject();
        });
      });
    });
  }

  createPortForwarding(e) {
    e.preventDefault();
    this.refs.portForwardingCreateModal.show();
  }

  onCreatePortForwarding(values) {
    const { dispatch, region, routerKey, network } = this.props;

    return new Promise((resolve, reject) => {
      const protocol = values.protocol;
      const outsidePort = parseInt(values.outsidePort, 10);
      const insideAddress = values.insideAddress;
      const insidePort = parseInt(values.insidePort, 10);

      dispatch(NetworkActions.requestCreatePortForwarding(routerKey, region.regionId, {
        networkId: network.networkId,
        protocol,
        outsidePort,
        insideAddress,
        insidePort,
      }))
      .then(() => {
        resolve();
        this.refs.portForwardingCreateModal.hide();
        this.onRefresh({}, false)();
      }).catch(() => {
        reject();
      });
    });
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.portForwardingSet.length > 0 && (
      <table className="table table-list">
        <thead>
          <tr>
            <th width="40">
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(this.props.context.portForwardingSet.map((u) => { return u.portForwardingId; }))}
                checked={this.isAllSelected(this.props.context.portForwardingSet.map((u) => { return u.portForwardingId; }))}
              />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('pageNetwork.protocol')}</th>
            <th>{t('pageNetwork.outsidePort')}</th>
            <th>{t('pageNetwork.insideAddress')}</th>
            <th>{t('pageNetwork.insidePort')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.portForwardingSet.map((portForwarding) => {
          return (
            <tr key={portForwarding.portForwardingId}>
              <td>
                <input
                  type="checkbox"
                  className="selected"
                  onChange={this.onSelect(portForwarding.portForwardingId)}
                  checked={this.props.context.selected[portForwarding.portForwardingId] === true}
                />
              </td>
              <td>{portForwarding.portForwardingId}</td>
              <td>{portForwarding.protocol}</td>
              <td>{portForwarding.outsidePort}</td>
              <td>{portForwarding.insideAddress}</td>
              <td>{portForwarding.insidePort}</td>
              <td>{moment.utc(portForwarding.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
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
              {t('portForwardingManageDescription')}
            </span>
          </div>
          <div className="nav-controls">
            <a className="btn btn-new" href onClick={this.createPortForwarding}>
              <i className="fa fa-plus"></i>&nbsp;{t('create')}
            </a>
          </div>
        </div>
        <Modal title={t('pageNetwork.createPortForwarding')} ref="portForwardingCreateModal" >
          <PortForwardingCreateForm onSubmit={this.onCreatePortForwarding} />
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
            <SearchBox ref="searchBox" placeholder={t('filterByIdorAddress')} onEnterPress={this.onSearchKeyPress} onButtonClick={this.onSearchButtonClick} />
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
              disabled: this.isBatchActionDisabled(['active'], this.props.context.portForwardingSet, 'portForwardingId'),
            })}
          </div>
        </div>}
      </div>
    );
  }
}

export default attach(C);
