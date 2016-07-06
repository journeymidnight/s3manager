import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import ButtonForm from '../../shared/forms/ButtonForm';
import TablePage from '../../shared/pages/TablePage';
import { alertModal } from '../../shared/components/Modal';
import * as Actions from '../redux/actions';
import * as RegionActions from '../redux/actions.region';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));

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
    const { region2 } = this.props;
    return RegionActions.requestDescribeAssignedQuotas(region2.regionId);
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.projectQuotaSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.projectQuotaSet.map((u) => { return u.projectId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('formProjectQuotaForm.quotaVCPUs')}</th>
            <th>{t('formProjectQuotaForm.quotaMemory')}</th>
            <th>{t('formProjectQuotaForm.quotaInstances')}</th>
            <th>{t('formProjectQuotaForm.quotaVolumes')}</th>
            <th>{t('formProjectQuotaForm.quotaVolumeSize')}</th>
            <th>{t('formProjectQuotaForm.quotaEIPs')}</th>
            <th width="100"></th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.projectQuotaSet.map((quota) => {
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
              <td><strong>{quota.name}</strong></td>
              <td>{quota.quotaVCPUs}</td>
              <td>{quota.quotaMemory} MB</td>
              <td>{quota.quotaInstances}</td>
              <td>{quota.quotaVolumes}</td>
              <td>{quota.quotaVolumeSize} GB</td>
              <td>{quota.quotaEIPs}</td>
              <td>
                <Link className="btn btn-sm btn-close" to={`/q/${this.props.region2.regionId}/${quota.projectId}/`}>
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
    const { t, region2 } = this.props;
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="pull-right">
            <Link className="btn btn-new" to={`/q/${region2.regionId}/create`}>
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
