import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import { confirmModal } from '../../shared/components/Modal';
import { buttonForm } from '../../shared/forms/ButtonForm';
import StatusFilter from '../../shared/components/StatusFilter';
import TimeSorter from '../../shared/components/TimeSorter';
import TablePage from '../../shared/pages/TablePage';
import SearchBox from '../../shared/components/SearchBox';
import * as Actions from '../../console-common/redux/actions';
import * as InstanceActions from '../redux/actions.instance';


class C extends TablePage {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.batchActions = this.batchActions.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onRestart = this.onRestart.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `${servicePath}/instances`));

    this.initTable(routerKey, {
      status: ['pending', 'active', 'starting', 'stopped', 'stopping', 'restarting', 'scheduling'],
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return InstanceActions.requestDescribeInstances(routerKey, region.regionId, filters);
  }

  isBatchActionDisabled(availabeStatuss) {
    const instanceIds = _.keys(this.props.context.selected);
    const unavailabeInstances = this.props.context.instanceSet.filter((instance) => {
      return instanceIds.indexOf(instance.instanceId) > -1 && availabeStatuss.indexOf(instance.status) === -1;
    });

    return !!unavailabeInstances.length;
  }

  batchActions(action) {
    const { dispatch, region, routerKey } = this.props;
    const instanceIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(action(routerKey, region.regionId, instanceIds))
      .then(() => {
        resolve();
        this.onRefresh({}, false)();
      }).catch(() => {
        reject();
      });
    });
  }

  onDelete() {
    const { t } = this.props;
    confirmModal(t('confirmDelete'), () => {
      return this.batchActions(InstanceActions.requestDeleteInstances);
    });
  }

  onStart() {
    return this.batchActions(InstanceActions.requestStartInstances);
  }

  onStop() {
    return this.batchActions(InstanceActions.requestStopInstances);
  }

  onRestart() {
    return this.batchActions(InstanceActions.requestRestartInstances);
  }

  connectVNC(instance) {
    return (e) => {
      e.preventDefault();

      const { dispatch, region, routerKey } = this.props;
      dispatch(InstanceActions.requestConnectVNC(routerKey, region.regionId, instance.instanceId));
    };
  }

  renderTable() {
    const { t, servicePath } = this.props;
    return this.props.context.total > 0 && this.props.context.instanceSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.instanceSet.map((u) => { return u.instanceId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('status')}</th>
            <th>{t('vcpus')}</th>
            <th>{t('memory')}</th>
            <th>{t('privateIP')}</th>
            <th>{t('publicIP')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.instanceSet.map((instance) => {
          return (
            <tr key={instance.instanceId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(instance.instanceId)} checked={this.props.context.selected[instance.instanceId] === true} />
              </td>
              <td>
                <Link to={`${servicePath}/instances/${instance.instanceId}`}>
                  {instance.instanceId}
                </Link>
                {instance.status === 'active' && <a className="pull-right" href onClick={this.connectVNC(instance)}>
                  <i className="fa fa-desktop"></i>
                </a>}
              </td>
              <td>
                {instance.name && <strong>{instance.name}</strong>}
                {!instance.name && <i className="text-muted">{t('noName')}</i>}
              </td>
              <td className={`i-status i-status-${instance.status}`}>
                <i className="icon"></i>
                {t(`instanceStatus.${instance.status}`)}
              </td>
              <td>{instance.currentVCPUs}</td>
              <td>{instance.currentMemory} MB</td>
              <td>{instance.address}</td>
              <td>{instance.eipId ? instance.eip.address : t('noName')}</td>
              <td>{moment.utc(instance.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
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
          <span>{t('instanceManageDescription')}</span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`${servicePath}/instances/create`}>
            <i className="fa fa-plus"></i>&nbsp;{t('create')}
          </Link>
        </div>
      </div>
    );
  }

  renderFilters() {
    const { t } = this.props;
    const statusOption = [
      {
        status: ['pending', 'active', 'starting', 'stopped', 'stopping', 'restarting', 'scheduling'],
        name: t('allAvaliableStatus'),
      }, {
        status: ['active'],
        name: t('instanceStatus.active'),
      }, {
        status: ['stopped'],
        name: t('instanceStatus.stopped'),
      }, {
        status: ['error'],
        name: t('instanceStatus.error'),
      }, {
        status: ['deleted', 'ceased'],
        name: t('instanceStatus.deleted'),
      }];
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="loading-display">
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
        {Object.keys(this.props.context.selected).length > 0 && <div>
          <div className="filter-item inline">
            {buttonForm({ onSubmit: this.onStart, text: t('pageInstance.startInstance'), disabled: this.isBatchActionDisabled(['stopped']) })}
          </div>
          <div className="filter-item inline">
            {buttonForm({ onSubmit: this.onRestart, text: t('pageInstance.restartInstance'), disabled: this.isBatchActionDisabled(['active']) })}
          </div>
          <div className="filter-item inline">
            {buttonForm({ onSubmit: this.onStop, text: t('pageInstance.stopInstance'), disabled: this.isBatchActionDisabled(['active']) })}
          </div>
          <div className="filter-item inline pull-right">
            {React.cloneElement(buttonForm(), {
              onSubmit: this.onDelete,
              text: t('delete'),
              type: 'btn-danger',
              disabled: this.isBatchActionDisabled(['active', 'stopped', 'error']),
            })}
          </div>
        </div>}
      </div>
    );
  }
}

export default attach(C);
