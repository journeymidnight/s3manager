import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import ButtonForm from '../../shared/forms/ButtonForm';
import TablePage from '../../shared/pages/TablePage';
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
    return this.props.context.total > 0 && this.props.context.tenantQuotaSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.tenantQuotaSet.map((u) => { return u.tenantId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th width="100"></th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.tenantQuotaSet.map((quota) => {
          return (
            <tr key={quota.tenantId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(quota.tenantId)} checked={this.props.context.selected[quota.tenantId] === true} />
              </td>
              <td>
                <Link to={`/tenants/${quota.tenantId}`}>
                  {quota.tenantId}
                </Link>
              </td>
              <td><strong>{quota.name}</strong></td>
              <td>
                <Link className="btn btn-sm btn-close" to={`/q/${this.props.region2.regionId}/${quota.tenantId}/`}>
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
