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
import * as EipActions from '../redux/actions.eip';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('eipManage'), `${servicePath}/eips`));

    this.initTable(routerKey, {
      status: ['active', 'associated'],
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return EipActions.requestDescribeEips(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { t, dispatch, routerKey, region } = this.props;
    confirmModal(t('confirmDelete'), () => {
      const eipIds = _.keys(this.props.context.selected);

      return new Promise((resolve, reject) => {
        dispatch(EipActions.requestReleaseEips(routerKey, region.regionId, eipIds))
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
    return this.props.context.total > 0 && this.props.context.eipSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(this.props.context.eipSet.map((u) => { return u.eipId; }))}
                checked={this.isAllSelected(this.props.context.eipSet.map((u) => { return u.eipId; }))}
              />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('bandwidth')}</th>
            <th>{t('associateResource')}</th>
            <th>{t('address')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.eipSet.map((eip) => {
            return (
              <tr key={eip.eipId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(eip.eipId)} checked={this.props.context.selected[eip.eipId] === true} />
                </td>
                <td>
                  <Link to={`${servicePath}/eips/${eip.eipId}`}>
                    {eip.eipId}
                  </Link>
                </td>
                <td>
                  {eip.name && <strong>{eip.name}</strong>}
                  {!eip.name && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td>{eip.bandwidth}Mbps</td>
                <td>
                  {eip.resourceId || <i className="text-muted">{t('noName')}</i>}
                </td>
                <td>{eip.address}</td>
                <td className={`i-status i-status-${eip.status}`}>
                  <i className="icon"></i>
                  {t(`eipStatus.${eip.status}`)}
                </td>
                <td className="light"><Time value={eip.created} format="YYYY-MM-DD HH:mm:ss" /></td>
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
            {t('eipManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`${servicePath}/eips/create`}>
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
        status: ['active', 'associated'],
        name: t('allAvaliableStatus'),
      }, {
        status: ['active'],
        name: t('eipStatus.active'),
      }, {
        status: ['associated'],
        name: t('eipStatus.associated'),
      }, {
        status: ['deleted'],
        name: t('eipStatus.deleted'),
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
            <ButtonForm
              onSubmit={this.onDelete}
              text={t('delete')}
              type="btn-danger"
              disabled={this.isBatchActionDisabled(['active'], this.props.context.eipSet, 'eipId')}
            />
          </div>
        </div>
      </div>
    );
  }

}

export default attach(C);
