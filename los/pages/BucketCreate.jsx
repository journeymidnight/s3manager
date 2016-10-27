import React from 'react';
import { push } from 'react-router-redux';
import AWS from 'aws-sdk';
import Page, { attach } from '../../shared/pages/Page';
import BucketCreateForm from '../forms/BucketCreateForm';
import { setHeader, extendContext, notify, notifyAlert } from '../../console-common/redux/actions';
import { requestGetS3Domain } from '../redux/actions.s3Domain';
import * as BucketActions from '../redux/actions.bucket';

class C extends Page {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath, region } = this.props;
    dispatch(setHeader(t('bucketList'), `${servicePath}/buckets`));
    dispatch(requestGetS3Domain(routerKey, region.regionId)).
    then(() => {
      dispatch(extendContext({ initialized: true }, routerKey));
    });
  }

  onSubmit(values) {
    const { dispatch, region, routerKey, servicePath, t } = this.props;
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
        dispatch(push(`${servicePath}/buckets`));
        setTimeout(() => dispatch(notify(t('bucketCreatedSuccess'))), 100);
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
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
