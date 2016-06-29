import React from 'react';
import { Link } from 'react-router';
import Time from 'react-time';
import _ from 'lodash';
import ButtonForm from '../../shared/forms/ButtonForm';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import * as Actions from '../redux/actions';
import * as SnapshotActions from '../redux/actions.snapshot';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('volumeSnapshotManage'), `/${region.regionId}/images_snapshots/volume_snapshots`));

    this.initTable({ isTabPage: true });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return SnapshotActions.requestDescribeSnapshots(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { dispatch, routerKey, region } = this.props;
    const snapshotIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(SnapshotActions.requestDeleteSnapshots(routerKey, region.regionId, snapshotIds))
        .then(() => {
          resolve();
          this.onRefresh({}, false)();
        }).catch(() => {
          reject();
        });
    });
  }

  renderTable() {
    const { t } = this.props;
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
                  <Link to={`/${this.props.region.regionId}/snapshots/${snapshot.snapshotId}`}>
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
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="filter-item inline labels-filter">
            <div className="dropdown">
              <button className="dropdown-menu-toggle" data-toggle="dropdown" type="button">
                <span className="dropdown-toggle-text">{t('status')}</span>
                <i className="fa fa-chevron-down"></i>
              </button>
              <div className="dropdown-menu dropdown-select dropdown-menu-selectable">
                <div className="dropdown-content">
                  <ul>
                    {[
                      {
                        status: ['pending', 'active', 'deleted', 'ceased', 'error'],
                        name: t('allAvaliableStatus'),
                      }, {
                        status: ['pending'],
                        name: t('volumeSnapshotsStatus.pending'),
                      }, {
                        status: ['active'],
                        name: t('volumeSnapshotsStatus.active'),
                      }, {
                        status: ['deleted', 'ceased'],
                        name: t('volumeSnapshotsStatus.deleted'),
                      }, {
                        status: ['error'],
                        name: t('volumeSnapshotsStatus.error'),
                      }].map((filter) => {
                        return (
                          <li key={filter.name}>
                            <a className={this.props.context.status.toString() === filter.status.toString() ? 'is-active' : ''} href onClick={this.onRefresh({ status: filter.status })}>
                              {filter.name}
                            </a>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="filter-item inline">
            <input type="search" ref="search" placeholder={t('filterByIdorName')} className="form-control" onKeyPress={this.onSearchKeyPress} />
          </div>
          <div className="pull-right">
            <div className="dropdown inline prepend-left-10">
              <button className="dropdown-toggle btn" data-toggle="dropdown" type="button">
                <span className="light"></span> {this.props.context.reverse ? t('lastCreated') : t('firstCreated')}
                <b className="caret"></b></button>
              <ul className="dropdown-menu dropdown-menu-align-right dropdown-select dropdown-menu-selectable">
                <li><a className={this.props.context.reverse ? 'is-active' : ''} href onClick={this.onRefresh({ reverse: true })}>{t('lastCreated')}</a></li>
                <li><a className={this.props.context.reverse ? '' : 'is-active'} href onClick={this.onRefresh({ reverse: false })}>{t('firstCreated')}</a></li>
              </ul>
            </div>
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
