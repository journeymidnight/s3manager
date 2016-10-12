import React from 'react';
import { push } from 'react-router-redux';
import AWS from 'aws-sdk';
import Page, { attach } from '../../shared/pages/Page';
import ObjectCreateForm from '../forms/ObjectCreateForm';
import { setHeader, extendContext, notify, notifyAlert } from '../../console-common/redux/actions';
import { requestGetS3Domain } from '../redux/actions.s3Domain';

class ObjectCreate extends Page {

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
    const { dispatch, region, servicePath, t } = this.props;
    const params = {
      Bucket: this.props.params.bucketName,
      Key: `${this.props.global.folderLocation}${values.objectName}/`,
    };

    AWS.config.endpoint = this.props.context.s3Domain;
    AWS.config.region = region.regionId;
    AWS.config.accessKeyId = region.accessKey;
    AWS.config.secretAccessKey = region.accessSecret;
    const s3 = new AWS.S3();

    s3.putObject(params, (error) => {
      if (error) {
        dispatch(notifyAlert(error.message)); // error has message? error.stack in s3 sdk doc;
      } else {
        dispatch(notify(t('folderCreatedSuccess')));
        setTimeout(() => dispatch(push(`${servicePath}/buckets/${this.props.params.bucketName}/objects`)), 300);
      }
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
                <span>{t('createFolder')}</span>
              </div>
            </div>
            <ObjectCreateForm
              onSubmit={this.onSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(ObjectCreate);
