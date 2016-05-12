import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import TenantQuotaForm from '../forms/TenantQuotaForm';
import * as RegionActions from '../redux/actions.region';

class C extends Page {

  componentDidMount() {
    const { params, dispatch } = this.props;

    this.regionId = params.regionId;
    this.tenantId = params.tenantId;
    dispatch(RegionActions.requestDescribeRegion(this.regionId));
    dispatch(RegionActions.requestDescribeAssignedQuota(this.regionId, this.tenantId));

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const quotaInstances = parseInt(values.quotaInstances, 10);
      const quotaCPU = parseInt(values.quotaCPU, 10);
      const quotaMemory = parseInt(values.quotaMemory, 10);
      const quotaImages = parseInt(values.quotaImages, 10);
      const quotaEIPs = parseInt(values.quotaEIPs, 10);
      const quotaVolumes = parseInt(values.quotaVolumes, 10);
      const quotaVolumeSize = parseInt(values.quotaVolumeSize, 10);
      const quotaKeypairs = parseInt(values.quotaKeypairs, 10);

      dispatch(RegionActions.requestAssignTenantQuota(this.regionId, this.tenantId, {
        quotaInstances,
        quotaCPU,
        quotaMemory,
        quotaImages,
        quotaEIPs,
        quotaVolumes,
        quotaVolumeSize,
        quotaKeypairs,
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
    const quota = this.props.context.quota;
    if (region === undefined || quota === undefined) {
      return <div />;
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <ol className="breadcrumb">
              <li><Link to="/regions">{t('regionManage')}</Link></li>
              <li className="active">{t('add')}</li>
            </ol>
            <TenantQuotaForm onSubmit={this.onSubmit} isUpdate initialValues={quota} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
