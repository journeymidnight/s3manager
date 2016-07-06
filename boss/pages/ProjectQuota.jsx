import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import ProjectQuotaForm from '../forms/ProjectQuotaForm';
import * as RegionActions from '../redux/actions.region';

class C extends Page {

  componentDidMount() {
    const { params, dispatch } = this.props;

    this.regionId = params.regionId;
    this.projectId = params.projectId;

    dispatch(RegionActions.requestDescribeRegion(this.regionId));
    dispatch(RegionActions.requestDescribeProjectQuota(this.regionId, this.projectId));

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const quotaInstances = parseInt(values.quotaInstances, 10);
      const quotaVCPUs = parseInt(values.quotaVCPUs, 10);
      const quotaMemory = parseInt(values.quotaMemory, 10);
      const quotaImages = parseInt(values.quotaImages, 10);
      const quotaEIPs = parseInt(values.quotaEIPs, 10);
      const quotaVolumes = parseInt(values.quotaVolumes, 10);
      const quotaVolumeSize = parseInt(values.quotaVolumeSize, 10);
      const quotaKeyPairs = parseInt(values.quotaKeyPairs, 10);

      dispatch(RegionActions.requestAssignProjectQuota(this.regionId, this.projectId, {
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
    const region = this.props.context.region;
    const quota = this.props.context.quota;
    if (region === undefined || quota === undefined) {
      return <div />;
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">

            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{this.projectId}</span>
              </div>
            </div>

            <ProjectQuotaForm onSubmit={this.onSubmit} initialValues={quota} isUpdate />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
