import React from 'react';
import { push } from 'react-router-redux';
import AWS from 'aws-sdk';
import Page, { attach } from '../../../shared/pages/Page';
import BucketCreateForm from '../forms/BucketCreateForm';
import { setHeader, extendContext, notify, notifyAlert } from '../../redux/actions';
import { requestGetS3Domain } from '../redux/actions.s3Domain';
import * as BucketActions from '../redux/actions.bucket';
import { Bar } from '../../../lecloud-design';


class C extends Page {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onCloseBucketCreate = this.onCloseBucketCreate.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath, region } = this.props;
    dispatch(setHeader(t('bucketList'), `${servicePath}/buckets`));
    dispatch(requestGetS3Domain(routerKey, region.regionId)).
      then(() => {
        dispatch(extendContext({ initialized: true }, routerKey));
      });
  }

  onCloseBucketCreate() {
    const { dispatch, servicePath } = this.props;
    dispatch(push(`${servicePath}/buckets`));
  }

  onSubmit(values) {
    const { dispatch, region, routerKey, servicePath, service, t } = this.props;
    const { serviceKey } = service;
    
    const bucketName = values.bucketName;
    const acl = values.acl;

    AWS.config.endpoint = this.props.context.s3Domain;
    AWS.config.region = region.regionId;
    AWS.config.accessKeyId = region.accessKey;
    AWS.config.secretAccessKey = region.accessSecret;
    AWS.config.maxRetries = 3;
    AWS.config.s3ForcePathStyle = true;
    const s3 = new AWS.S3();

    dispatch(BucketActions.requestCreateBucket(routerKey, region.regionId, bucketName))
      .then(() => {
        return dispatch(BucketActions.requestPutCors(routerKey, region.regionId, bucketName));
      })
      .then(() => {
        return dispatch(BucketActions.requestPutBucketAcl(s3, bucketName, acl));
      })
      .then(() => {
        dispatch(push(`${serviceKey}/buckets`));
        //setTimeout(() => dispatch(notify(t('bucketCreatedSuccess'))), 100);
        setTimeout(() => dispatch(notify(t('bucketCreatedSuccess'), 'notice', 200)), 100);
      })
      .catch((error) => {
        dispatch(notifyAlert(error.message));
      });
  }

  renderAfterInitialized() {
    const { t } = this.props;
    return (
      <div className="content">
        <Bar>
          <h2 className="bar-title">{t('pageBucketCreate.createBucket')}</h2>
        </Bar>
        <div className="content-body">
          <BucketCreateForm
            onSubmit={this.onSubmit}
            closeForm={this.onCloseBucketCreate}
          />
        </div>
      </div>
    );
  }
}

export default attach(C);
