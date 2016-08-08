import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import QuotaForm from '../forms/QuotaForm';
import * as ServiceActions from '../redux/actions.service';

class C extends Page {

  initialize() {
    const { params, dispatch } = this.props;

    this.serviceId = params.serviceId;
    dispatch(ServiceActions.requestDescribeService(this.serviceId));

    this.onSubmit = this.onSubmit.bind(this);
    this.defaultQuota = {
      instances: 2,
      vCPUs: 8,
      memory: 16,
      images: 2,
      eIPs: 1,
      volumes: 2,
      volumeSize: 100,
      keyPairs: 2,
    };
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
    const { t } = this.props;

    const service = this.props.context.service;
    if (service === undefined) {
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

            <QuotaForm onSubmit={this.onSubmit} initialValues={this.defaultQuota} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
