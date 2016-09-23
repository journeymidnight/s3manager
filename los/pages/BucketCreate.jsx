import React from 'react';
import { push } from 'react-router-redux';
import AWS from 'aws-sdk';
import Page, { attach } from '../../shared/pages/Page';
import BucketCreateForm from '../forms/BucketCreateForm';
import * as Actions from '../../console-common/redux/actions';
import * as BucketActions from '../redux/actions.bucket';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath, region } = this.props;

    dispatch(Actions.setHeader(t('bucketList'), `${servicePath}/buckets`));
    dispatch(BucketActions.requestGetS3Domain(routerKey, region.regionId)).
    then(() => {
      dispatch(Actions.extendContext({ initialized: true }, routerKey));
    });
  }

  onSubmit(values) {
    const { dispatch, region, routerKey, servicePath } = this.props;

    return new Promise((resolve, reject) => {
      const bucketName = values.bucketName;
      const acl = values.acl;

      AWS.config.endpoint = this.props.context.s3Domain;
      AWS.config.region = region.regionId;
      AWS.config.accessKeyId = region.accessKey;
      AWS.config.secretAccessKey = region.accessSecret;
      const s3 = new AWS.S3();

      dispatch(BucketActions.requestCreateBucket(routerKey, region.regionId, bucketName))
        .then(() => {
          return dispatch(BucketActions.requestPutCors(routerKey, region.regionId, bucketName));
        })
        .then(() => {
          return dispatch(BucketActions.requestPutBucketAcl(s3, bucketName, acl));
        })
        .then(() => {
          resolve();
          dispatch(push(`${servicePath}/buckets`));
        })
        .catch((error) => {
          dispatch(Actions.notifyAlert(error.message));
          reject({ _error: error.message });
        });
    });
  }

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
