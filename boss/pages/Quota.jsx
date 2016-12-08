import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import QuotaForm from '../forms/QuotaForm';
import * as ServiceActions from '../redux/actions.service';

class C extends Page {

  initialize() {
    const { params, dispatch } = this.props;

    this.serviceId = params.serviceId;
    this.projectId = params.projectId;

    dispatch(ServiceActions.requestDescribeService(this.serviceId))
    .then(() => {
      const service = this.props.context.service;
      dispatch(ServiceActions.requestDescribeQuota(service.serviceKey, service.regionId, this.projectId));
    });

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values, dispatch) {
    const service = this.props.context.service;

    return new Promise((resolve, reject) => {
      const projectId = values.projectId;
      const instances = parseInt(values.instances, 10);
      const vCPUs = parseInt(values.vCPUs, 10);
      const memory = parseInt(values.memory, 10);
      const images = parseInt(values.images, 10);
      const eIPs = parseInt(values.eIPs, 10);
      const volumes = parseInt(values.volumes, 10);
      const volumeSize = parseInt(values.volumeSize, 10);
      const keyPairs = parseInt(values.keyPairs, 10);
      const networks = parseInt(values.networks, 10);
      const snapshots = parseInt(values.snapshots, 10);

      dispatch(ServiceActions.requestAssignQuota(service.serviceKey, service.regionId, projectId, {
        instances,
        vCPUs,
        memory,
        images,
        eIPs,
        volumes,
        volumeSize,
        keyPairs,
        networks,
        snapshots,
      }))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  render() {
    const service = this.props.context.service;
    const quota = this.props.context.quota;
    if (service === undefined || quota === undefined) {
      return <div />;
    }

    const defaultQuota = Object.assign({}, quota.quota);
    defaultQuota.projectId = quota.projectId;

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">

            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{this.projectId}</span>
              </div>
            </div>

            <QuotaForm onSubmit={this.onSubmit} initialValues={defaultQuota} isUpdate />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
