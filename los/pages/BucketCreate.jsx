import React from 'react';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import BucketCreateForm from '../forms/BucketCreateForm';
import * as Actions from '../../console-common/redux/actions';
import * as InstanceActions from '../../lcs/redux/actions.instance';
import * as BucketActions from '../redux/actions.bucket';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;

    dispatch(Actions.setHeader(t('bucketList'), `${servicePath}/buckets`));
    dispatch(Actions.extendContext({ initialized: true }, routerKey));
  }

  onSubmit(values) {
    const { dispatch, region, routerKey, servicePath } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.hostname;
      const imageId = values.imageId;
      const instanceTypeId = values.instanceTypeId;
      const subnetId = values.subnetId;
      const keyPairId = values.keyPairId;
      const loginMode = values.loginMode;
      const loginPassword = values.loginPassword;
      const count = parseInt(values.count, 10) || 1;

      dispatch(InstanceActions.requestCreateInstances(routerKey, region.regionId, {
        name,
        imageId,
        instanceTypeId,
        subnetId,
        count,
        loginMode,
        loginPassword,
        keyPairId,
      }))
          .then(() => {
            resolve();
            dispatch(push(`${servicePath}/instances`));
          }).catch((error) => {
        dispatch(Actions.notifyAlert(error.message));
        reject({ _error: error.message });
      });
    });
  } // TODO: Change this method for create bucket

  renderAfterInitialized() {
    const { t } = this.props;

    return (
        <div className="container-fluid container-limited">
          <div className="content">
            <div className="clearfix">
              <div className="top-area append-bottom-20">
                <div className="nav-text">
                  <span>{t('pageBucketCreate.createBucket')}</span>
                </div>
              </div>
              <BucketCreateForm
                  onSubmit={this.onSubmit}
              />
            </div>
          </div>
        </div>
    );
  }
}

export default attach(C);
