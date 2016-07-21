import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import ButtonForm from '../../shared/forms/ButtonForm';
import TablePage from '../../shared/pages/TablePage';
import { alertModal } from '../../shared/components/Modal';
import * as Actions from '../redux/actions';
import * as ServiceActions from '../redux/actions.service';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('serviceManage'), '/services'));

    this.initTable({ isTabPage: true });
  }

  onDelete() {
    const { t } = this.props;

    alertModal(t('notSupportedYet'));

    return new Promise((resolve, reject) => {
      reject();
    });
  }

  refreshAction() {
    const { service2 } = this.props;
    return ServiceActions.requestDescribeAssignedQuotas(service2);
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
            <th>{t('formQuotaForm.quotaVCPUs')}</th>
            <th>{t('formQuotaForm.quotaMemory')}</th>
            <th>{t('formQuotaForm.quotaInstances')}</th>
            <th>{t('formQuotaForm.quotaVolumes')}</th>
            <th>{t('formQuotaForm.quotaVolumeSize')}</th>
            <th>{t('formQuotaForm.quotaEIPs')}</th>
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
              <td>{quota.quota.VCPUs}</td>
              <td>{quota.quota.Memory} MB</td>
              <td>{quota.quota.Instances}</td>
              <td>{quota.quota.Volumes}</td>
              <td>{quota.quota.VolumeSize} GB</td>
              <td>{quota.quota.EIPs}</td>
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
