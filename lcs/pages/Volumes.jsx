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
import * as Actions from '../../console-common/redux/actions';
import * as VolumeActions from '../redux/actions.volume';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('volumeManage'), `${servicePath}/volumes`));

    this.initTable(routerKey, {
      status: ['pending', 'active', 'attaching', 'inuse', 'backup_ing', 'backup_restoring'],
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return VolumeActions.requestDescribeVolumes(routerKey, region.regionId, filters);
  }

  isBatchDeleteDisabled() {
    const volumeIds = _.keys(this.props.context.selected);
    const unavailabeVolumes = this.props.context.volumeSet.filter((volume) => {
      return volumeIds.indexOf(volume.volumeId) > -1 && ['active', 'error'].indexOf(volume.status) === -1;
    });

    return !!unavailabeVolumes.length;
  }

  onDelete() {
    const { t, dispatch, routerKey, region } = this.props;
    const volumeIds = _.keys(this.props.context.selected);

    confirmModal(t('confirmDelete'), () => {
      return new Promise((resolve, reject) => {
        dispatch(VolumeActions.requestDeleteVolumes(routerKey, region.regionId, volumeIds))
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
    return this.props.context.total > 0 && this.props.context.volumeSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.volumeSet.map((u) => { return u.volumeId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('size')}</th>
            <th>{t('attachInstance')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.volumeSet.map((volume) => {
            return (
              <tr key={volume.volumeId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(volume.volumeId)} checked={this.props.context.selected[volume.volumeId] === true} />
                </td>
                <td>
                  <Link to={`${servicePath}/volumes/${volume.volumeId}`}>
                    {volume.volumeId}
                  </Link>
                </td>
                <td>
                  {volume.name && <strong>{volume.name}</strong>}
                  {!volume.name && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td>{volume.size}G</td>
                <td>
                  {volume.instanceId || <i className="text-muted">{t('noName')}</i>}
                </td>
                <td className={`i-status i-status-${volume.status}`}>
                  <i className="icon"></i>
                  {t(`volumeStatus.${volume.status}`)}
                </td>
                <td className="light"><Time value={volume.created} format="YYYY-MM-DD HH:mm:ss" /></td>
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
            {t('volumeManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`${servicePath}/volumes/create`}>
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
        status: ['pending', 'active', 'attaching', 'inuse', 'backup_ing', 'backup_restoring'],
        name: t('allAvaliableStatus'),
      }, {
        status: ['active'],
        name: t('volumeStatus.active'),
      }, {
        status: ['inuse'],
        name: t('volumeStatus.inuse'),
      }, {
        status: ['error'],
        name: t('volumeStatus.error'),
      }, {
        status: ['deleted', 'ceased'],
        name: t('volumeStatus.deleted'),
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
            <input type="search" ref="search" placeholder={t('filterByIdorName')} className="form-control" onKeyPress={this.onSearchKeyPress} />
          </div>
          <div className="pull-right">
            <TimeSorter isReverse={this.props.context.reverse} onRefresh={this.onRefresh} />
          </div>
        </div>
        <div className={Object.keys(this.props.context.selected).length > 0 ? '' : 'hidden'}>
          <div className="filter-item inline">
            <ButtonForm onSubmit={this.onDelete} text={t('delete')} type="btn-danger" disabled={this.isBatchDeleteDisabled()} />
          </div>
        </div>
      </div>
    );
  }

}

export default attach(C);
