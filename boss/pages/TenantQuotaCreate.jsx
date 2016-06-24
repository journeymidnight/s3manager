import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import TenantQuotaForm from '../forms/TenantQuotaForm';
import * as RegionActions from '../redux/actions.region';

class C extends Page {

  componentDidMount() {
    const { params, dispatch } = this.props;

    this.regionId = params.regionId;
    dispatch(RegionActions.requestDescribeRegion(this.regionId));

    this.onSubmit = this.onSubmit.bind(this);
    this.defaultTenantQuota = {
      quotaInstances: 2,
      quotaVCPUs: 8,
      quotaMemory: 16,
      quotaImages: 2,
      quotaEIPs: 1,
      quotaVolumes: 2,
      quotaVolumeSize: 100,
      quotaKeyPairs: 2,
    };
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const tenantId = values.tenantId;
      const quotaInstances = parseInt(values.quotaInstances, 10);
      const quotaVCPUs = parseInt(values.quotaVCPUs, 10);
      const quotaMemory = parseInt(values.quotaMemory, 10);
      const quotaImages = parseInt(values.quotaImages, 10);
      const quotaEIPs = parseInt(values.quotaEIPs, 10);
      const quotaVolumes = parseInt(values.quotaVolumes, 10);
      const quotaVolumeSize = parseInt(values.quotaVolumeSize, 10);
      const quotaKeyPairs = parseInt(values.quotaKeyPairs, 10);

      dispatch(RegionActions.requestAssignTenantQuota(this.regionId, tenantId, {
        quotaInstances,
        quotaVCPUs,
        quotaMemory,
        quotaImages,
        quotaEIPs,
        quotaVolumes,
        quotaVolumeSize,
        quotaKeyPairs,
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

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">

            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{t('create')}</span>
              </div>
            </div>

            <TenantQuotaForm onSubmit={this.onSubmit} initialValues={this.defaultTenantQuota} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
