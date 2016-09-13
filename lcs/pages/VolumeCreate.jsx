import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import VolumeForm from '../forms/VolumeForm';
import { notifyAlert } from '../../console-common/redux/actions';
import * as VolumeActions from '../redux/actions.volume';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /* initialize() {
    const { dispatch, region, routerKey } = this.props;
    dispatch(SnapshotActions.requestDescribeSnapshots(routerKey, region.regionId, { status: ['active'] }));
  }*/

  onSubmit(values) {
    const { dispatch, region, routerKey, servicePath } = this.props;

    const name = values.name;
    const size = Number(values.size);
    const count = Number(values.count);
    const snapshotId = values.snapshotId;

    return new Promise((resolve, reject) => {
      dispatch(VolumeActions.requestCreateVolume(routerKey, region.regionId, {
        name,
        size: snapshotId ? 1 : size,
        count,
        snapshotId,
        volumeType: snapshotId ? '' : 'normal',
      }))
        .then(() => {
          resolve();
          dispatch(push(`${servicePath}/volumes`));
        }).catch((error) => {
          dispatch(notifyAlert(error.displayMsg || error.message));
          reject({ _error: error.message });
        });
    });
  }

  render() {
    const { t } = this.props;
    const availableSnapshots = this.props.context.snapshotSet || [];

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{t('pageVolumeCreate.createVolume')}</span>
              </div>
            </div>
            <VolumeForm onSubmit={this.onSubmit} availableSnapshots={availableSnapshots} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
