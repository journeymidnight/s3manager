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
import * as KeyPairActions from '../redux/actions.key_pair';

class C extends TablePage {

  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('keyPairManage'), `${servicePath}/key_pairs`));

    this.initTable(routerKey, {
      status: ['active'],
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return KeyPairActions.requestDescribeKeyPairs(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { t, dispatch, routerKey, region } = this.props;

    confirmModal(t('confirmDelete'), () => {
      const keyPairIds = _.keys(this.props.context.selected);
      return new Promise((resolve, reject) => {
        dispatch(KeyPairActions.requestDeleteKeyPairs(routerKey, region.regionId, keyPairIds))
          .then(() => {
            this.onRefresh({}, false)();
            resolve();
          }).catch(() => {
            reject();
          });
      });
    });
  }

  renderTable() {
    const { t, servicePath } = this.props;
    return this.props.context.total > 0 && this.props.context.keyPairSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.keyPairSet.map((u) => { return u.keyPairId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.keyPairSet.map((keyPair) => {
            return (
              <tr key={keyPair.keyPairId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(keyPair.keyPairId)} checked={this.props.context.selected[keyPair.keyPairId] === true} />
                </td>
                <td>
                  <Link to={`${servicePath}/key_pairs/${keyPair.keyPairId}`}>
                    {keyPair.keyPairId}
                  </Link>
                </td>
                <td>
                  {keyPair.name && <strong>{keyPair.name}</strong>}
                  {!keyPair.name && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td className={`i-status i-status-${keyPair.status}`}>
                  <i className="icon"></i>
                  {t(`keyPairStatus.${keyPair.status}`)}
                </td>
                <td><Time value={keyPair.created} format="YYYY-MM-DD HH:mm:ss" /></td>
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
            {t('keyPairManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`${servicePath}/key_pairs/create`}>
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
        name: t('keyPairStatus.active'),
      }, {
        status: ['deleted'],
        name: t('keyPairStatus.deleted'),
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
