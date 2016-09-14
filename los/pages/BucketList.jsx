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
import * as Actions from '../../console-common/redux/actions';
import * as BucketActions from '../redux/actions.bucket';


class C extends TablePage {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.batchActions = this.batchActions.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('bucketList'), `${servicePath}/buckets`));

    this.initTable(routerKey, {
      status: ['pending', 'active', 'starting', 'stopped', 'stopping', 'restarting', 'scheduling'],
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return BucketActions.requestListBuckets(routerKey, region.regionId, filters);
  }

  isBatchActionDisabled(availabeStatuss) {
    const instanceIds = _.keys(this.props.context.selected);
    const unavailabeInstances = this.props.context.buckets.filter((instance) => {
      return instanceIds.indexOf(instance.instanceId) > -1 && availabeStatuss.indexOf(instance.status) === -1;
    });

    return !!unavailabeInstances.length;
  }

  batchActions(action) {
    const { dispatch, region, routerKey } = this.props;
    const bucketNames = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(action(routerKey, region.regionId, bucketNames))
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
      return this.batchActions(BucketActions.requestDeleteBuckets);
    });
  }

  renderTable() {
    const { t, servicePath } = this.props;
    return this.props.context.buckets.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.buckets.map((u) => { return u.name; }))} />
            </th>
            <th width="200">{t('name')}</th>
            <th width="400">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.buckets.map((bucket) => {
          return (
            <tr key={bucket.name}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(bucket.name)} checked={this.props.context.selected[bucket.name] === true} />
              </td>
              <td>
                <Link to={`${servicePath}/buckets/${bucket.name}`}>
                  {bucket.name}
                </Link>
              </td>
              <td>{moment.utc(bucket.creationDate).local().format('YYYY-MM-DD HH:mm:ss')}</td>
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
          <span>{t('bucketListDescription')}</span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`${servicePath}/buckets/create`}>
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
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>

          <div className="filter-item inline">
            <input type="search" ref="search" placeholder={t('filterByIdorName')} className="form-control" onKeyPress={this.onSearchKeyPress} />
          </div>
        </div>
        {Object.keys(this.props.context.selected).length > 0 && <div>
          <div className="filter-item inline">
            {React.cloneElement(buttonForm(), {
              onSubmit: this.onDelete,
              text: t('delete'),
              type: 'btn-danger',
              disabled: this.isBatchActionDisabled(['active', 'stopped', 'error']), // TODO: modify disabled for available buckets
            })}
          </div>
        </div>}
      </div>
    );
  }
}

export default attach(C);
