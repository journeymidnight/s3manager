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
import * as AccessKeyActions from '../redux/actions.access_key';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }


  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('accessKeyManage'), '/access_keys'));

    this.initTable();
  }

  refreshAction(routerKey, filters) {
    return AccessKeyActions.requestDescribeAccessKeys(filters);
  }

  onDelete() {
    const { dispatch } = this.props;
    const accessKeyIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(AccessKeyActions.requestDeleteAccessKeys(accessKeyIds))
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
    return this.props.context.total > 0 && this.props.context.accessKeySet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.accessKeySet.map((u) => { return u.accessKey; }))} />
            </th>
            <th width="150">{t('access_key')}</th>
            <th>{t('name')}</th>
            <th>{t('access_secret')}</th>
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
                  {accessKey.accessKey}
                </td>
                <td>
                  {accessKey.name && <strong>{accessKey.name}</strong>}
                  {!accessKey.name && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td>{accessKey.accessSecret}</td>
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
        status: ['active', 'deleted'],
        name: t('allAvaliableStatus'),
      }, {
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
