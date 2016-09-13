import React from 'react';
import { Link } from 'react-router';
import Time from 'react-time';
import _ from 'lodash';
import ButtonForm from '../../shared/forms/ButtonForm';
import { confirmModal } from '../../shared/components/Modal';
import StatusFilter from '../../shared/components/StatusFilter';
import TimeSorter from '../../shared/components/TimeSorter';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import SearchBox from '../../shared/components/SearchBox';
import * as Actions from '../../console-common/redux/actions';
import * as SnapshotActions from '../redux/actions.snapshot';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('volumeSnapshotManage'), `${servicePath}/images_snapshots/volume_snapshots`));

    this.initTable(routerKey, {
      isTabPage: true,
      status: ['pending', 'active'],
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return SnapshotActions.requestDescribeSnapshots(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { t, dispatch, routerKey, region } = this.props;
    const snapshotIds = _.keys(this.props.context.selected);

    confirmModal(t('confirmDelete'), () => {
      return new Promise((resolve, reject) => {
        dispatch(SnapshotActions.requestDeleteSnapshots(routerKey, region.regionId, snapshotIds))
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
    return this.props.context.total > 0 && this.props.context.snapshotSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.snapshotSet.map((u) => { return u.snapshotId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('size')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.snapshotSet.map((snapshot) => {
            return (
              <tr key={snapshot.snapshotId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(snapshot.snapshotId)} checked={this.props.context.selected[snapshot.snapshotId] === true} />
                </td>
                <td>
                  <Link to={`${servicePath}/snapshots/${snapshot.snapshotId}`}>
                    {snapshot.snapshotId}
                  </Link>
                </td>
                <td>
                  {snapshot.name && <strong>{snapshot.name}</strong>}
                  {!snapshot.name && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td>{snapshot.size}G</td>
                <td className={`i-status i-status-${snapshot.status}`}>
                  <i className="icon"></i>
                  {t(`volumeSnapshotsStatus.${snapshot.status}`)}
                </td>
                <td className="light"><Time value={snapshot.created} format="YYYY-MM-DD HH:mm:ss" /></td>
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
      <div className="top-area">
        <div className="nav-text">
          <span className="light">
            {t('volumeSnapshotManageDescription')}
          </span>
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
        name: t('volumeSnapshotsStatus.active'),
      }, {
        status: ['error'],
        name: t('volumeSnapshotsStatus.error'),
      }, {
        status: ['deleted', 'ceased'],
        name: t('volumeSnapshotsStatus.deleted'),
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
