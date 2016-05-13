import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import * as RegionActions from '../redux/actions.region';
import RegionForm from '../forms/RegionForm';

class C extends Page {

  componentDidMount() {
    const { params, dispatch } = this.props;

    this.regionId = params.regionId;
    dispatch(RegionActions.requestDescribeRegion(this.regionId));
    dispatch(RegionActions.requestDescribeAssignedQuotas(this.regionId));

    this.onSave = this.onSave.bind(this);
  }

  onSave(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const opKeystoneEndpoint = values.opKeystoneEndpoint;
      const opAdminName = values.opAdminName;
      const opAdminPassword = values.opAdminPassword;

      dispatch(RegionActions.requestModifyRegion({
        regionId: this.regionId,
        name,
        opKeystoneEndpoint,
        opAdminName,
        opAdminPassword,
      }))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  render() {
    const { t } = this.props;

    const region = this.props.context.region;
    if (region === undefined) {
      return <div />;
    }

    let tenants = <div className="nothing-here-block">{t('nothingHere')}</div>;
    if (this.props.context.quotas && this.props.context.quotas.total > 0) {
      tenants = (
        <table className="table">
          <thead>
            <tr>
              <th>{t('id')}</th>
              <th>{t('name')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {this.props.context.quotas.tenantQuotaSet.map((tenant) => {
            return (
              <tr key={tenant.tenantId}>
                <td>{tenant.tenantId}</td>
                <td>
                  <Link to={`/tenants/${tenant.tenantId}`}>
                    <strong>
                    {tenant.name}
                    </strong>
                  </Link>
                </td>
                <td>
                  <Link className="btn btn-sm btn-close" to={`/regions/${this.regionId}/${tenant.tenantId}/`}>
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

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <ol className="breadcrumb">
              <li><Link to="/regions">{t('regionManage')}</Link></li>
              <li className="active">{region.name}</li>
            </ol>
            <div className="panel panel-default">
              <div className="panel-heading">{t('settings')}</div>
              <div className="errors-holder"></div>
              <div className="panel-body">
                <RegionForm initialValues={region} onSubmit={this.onSave} isUpdate />
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">{t('pageRegion.assignedTenants')}</div>
              <div className="errors-holder"></div>
              <div className="panel-body">
                {tenants}
                <div className="form-actions">
                  <Link className="btn btn-save" to={`/regions/${this.regionId}/new`}>
                    {t('add')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default attach(C);
