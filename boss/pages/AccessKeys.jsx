import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Time from 'react-time';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import { confirmModal } from '../../lecloud-design/components/Modal/Modal';
import SearchBox from '../../shared/components/SearchBox';
import * as Actions from '../redux/actions';
import * as AccessKeyActions from '../redux/actions.access_key';
import { Bar, Select, CheckBox, Loading } from '../../lecloud-design';
import '../../shared/scss/base.scss';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch} = this.props;
    dispatch(Actions.setHeader(t('accessKeyManage'), '/access_keys'));

    this.initTable(routerKey, {
      status: ['active'],
    });
  }

  refreshAction(routerKey, filters) {
    const {projectId } = this.props.consoleheader;
    return AccessKeyActions.requestDescribeAccessKeys(filters, projectId);
  }

  onDelete() {
    const { t, dispatch } = this.props;
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
            <th style={{ width: 54 }} >
              <CheckBox
                onClick={this.onSelectAll(this.props.context.accessKeySet.map((u) => { return u.accessKey; }))}
                isChecked={this.isAllSelected(this.props.context.accessKeySet.map((u) => { return u.accessKey; }))}
              />
            </th>
            <th width="30%">{t('name')}</th>
            <th width="30%">{t('accessKey')}</th>
            <th width="30%">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.accessKeySet.map((accessKey) => {
            return (
              <tr key={accessKey.accessKey}>
                <td>
                  <CheckBox
                    onClick={this.onSelect(accessKey.accessKey)}
                    isChecked={this.props.context.selected[accessKey.accessKey] === true}
                  />
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
                <td className="light"><Time value={accessKey.created} format="YYYY-MM-DD HH:mm:ss" /></td>
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
        <Bar>
          <h2 className="bar-title">{t('sidebarAccessKey')}</h2>
          <div className="pull-right">
            <Link className="button" to={'/access_keys/create'}>
              <i className="iconfont icon-create"></i>&nbsp; {t('create')}
            </Link>
          </div>
        </Bar>

        <Bar type="secondary">
          <p className="bar-description">{t('accessKeyManageDescription')}</p>
        </Bar>
      </div>
    );
  }

  renderFilters() {
    const { t, context } = this.props;
    const statusOption = [
      {
        status: ['active'],
        name: t('accessKeyStatus.active'),
      }, {
        status: ['deleted'],
        name: t('accessKeyStatus.deleted'),
      }];

    const createTimeOption = [
      {
        value: true,
        name: t('lastCreated'),
      }, {
        value: false,
        name: t('firstCreated'),
      }];

    return (
      <Bar>
        {Object.keys(this.props.context.selected).length === 0 && <div>
          <button
            className="button button-icon"
            onClick={this.doSearch}
          >
            <Loading loading={context.loading} />
          </button>
          <SearchBox ref="searchBox" placeholder={t('filterByIdorName')} onEnterPress={this.onSearchKeyPress} onButtonClick={this.onSearchButtonClick} />
        </div>}
        {Object.keys(this.props.context.selected).length > 0 && <button
          disabled={this.isBatchActionDisabled(['active'], context.accessKeySet, 'accessKey')}
          className="button button-red"
          onClick={this.onDelete}
        >
          <i className="iconfont icon-remove" />
          &nbsp;
          {t('delete')}
        </button>}
      </Bar>
    );
  }

}

export default attach(C);