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
import * as AccessKeyActions from '../redux/actions.access_key';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('accessKeyManage'), '/access_keys'));

    this.initTable(routerKey, {
      status: ['active'],
    });
  }

  refreshAction(routerKey, filters) {
    return AccessKeyActions.requestDescribeAccessKeys(filters);
  }

  onDelete() {
    const { dispatch, t } = this.props;
    const accessKeyIds = _.keys(this.props.context.selected);
    confirmModal(t('confirmDelete'), () => {
      return new Promise((resolve, reject) => {
        dispatch(AccessKeyActions.requestDeleteAccessKeys(accessKeyIds))
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
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.accessKeySet.length > 0 && (
      <table className="table table-list">
        <thead>
          <tr>
            <th width="40">
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(this.props.context.accessKeySet.map((u) => { return u.accessKey; }))}
                checked={this.isAllSelected(this.props.context.accessKeySet.map((u) => { return u.accessKey; }))}
              />
            </th>
            <th width="150">{t('name')}</th>
            <th>{t('accessKey')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.accessKeySet.map((accessKey) => {
            return (
              <tr key={accessKey.accessKey}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(accessKey.accessKey)} checked={this.props.context.selected[accessKey.accessKey] === true} />
                </td>
                <td>
                  <span className="list-item-name">
                  {accessKey.name && <strong>{accessKey.name}</strong>}
                  {!accessKey.name && <i className="text-muted">{t('noName')}</i>}
                  </span>
                </td>
                <td>
                  <div>
                    {accessKey.accessKey}
                    <br />
                    {accessKey.accessSecret}
                  </div>
                </td>
                <td className={`i-status i-status-${accessKey.status}`}>
                  <i className="icon"></i>
                  {t(`accessKeyStatus.${accessKey.status}`)}
                </td>
                <td className="light"><Time value={accessKey.created} format="YYYY-MM-DD HH:mm:ss" /></td>
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
            {t('accessKeyManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`${servicePath}/access_keys/create`}>
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
        status: ['active'],
        name: t('accessKeyStatus.active'),
      }, {
        status: ['deleted'],
        name: t('accessKeyStatus.deleted'),
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
            <SearchBox ref="searchBox" placeholder={t('filterByName')} onEnterPress={this.onSearchKeyPress} onButtonClick={this.onSearchButtonClick} />
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
              disabled={this.isBatchActionDisabled(['active'], this.props.context.accessKeySet, 'accessKey')}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
