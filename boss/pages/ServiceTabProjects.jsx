import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import ButtonForm from '../../shared/forms/ButtonForm';
import TablePage from '../../shared/pages/TablePage';
import * as Actions from '../redux/actions';
import * as ServiceActions from '../redux/actions.service';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('serviceManage'), '/services'));

    this.initTable(routerKey, { isTabPage: true });
  }

  onDelete() {
    const { dispatch, routerKey, service2 } = this.props;
    const projectIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(ServiceActions.requestDeleteQuotas(
        routerKey,
        service2.serviceKey,
        service2.regionId,
        projectIds
      ))
      .then(() => {
        resolve();
        this.onRefresh({}, false)();
      }).catch(() => {
        reject();
      });
    });
  }

  refreshAction() {
    const { service2 } = this.props;
    return ServiceActions.requestDescribeAssignedQuotas(service2.serviceKey, service2.regionId);
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.quotaSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.quotaSet.map((u) => { return u.projectId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('formQuotaForm.vCPUs')}</th>
            <th>{t('formQuotaForm.memory')}</th>
            <th>{t('formQuotaForm.instances')}</th>
            <th>{t('formQuotaForm.volumes')}</th>
            <th>{t('formQuotaForm.volumeSize')}</th>
            <th>{t('formQuotaForm.eIPs')}</th>
            <th width="100"></th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.quotaSet.map((quota) => {
          return (
            <tr key={quota.projectId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(quota.projectId)} checked={this.props.context.selected[quota.projectId] === true} />
              </td>
              <td>
                <Link to={`/projects/${quota.projectId}`}>
                  {quota.projectId}
                </Link>
              </td>
              <td>{quota.quota.vCPUs}</td>
              <td>{quota.quota.memory} MB</td>
              <td>{quota.quota.instances}</td>
              <td>{quota.quota.volumes}</td>
              <td>{quota.quota.volumeSize} GB</td>
              <td>{quota.quota.eIPs}</td>
              <td>
                <Link className="btn btn-sm btn-close" to={`/q/${this.props.service2.serviceId}/${quota.projectId}/`}>
                  <i className="fa fa-cog" /> 配置
                </Link>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }

  renderFilters() {
    const { t, service2 } = this.props;
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="pull-right">
            <Link className="btn btn-new" to={`/q/${service2.serviceId}/create`}>
              <i className="fa fa-plus"></i>&nbsp;{t('create')}
            </Link>
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
