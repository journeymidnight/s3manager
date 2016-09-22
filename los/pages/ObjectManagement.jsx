import _ from 'lodash';
import moment from 'moment';
import AWS from 'aws-sdk';
import React from 'react';
import update from 'react-addons-update';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import { buttonForm } from '../../shared/forms/ButtonForm';
import Modal, { confirmModal } from '../../shared/components/Modal';
import TablePageStatic from '../../shared/pages/TablePageStatic';
import * as Actions from '../../console-common/redux/actions';
import * as ObjectActions from '../redux/actions.object';
import * as BucketActions from '../redux/actions.bucket';

class C extends TablePageStatic {

  constructor(props) {
    super(props);
    const { t } = this.props;
    this.state = {
      s3: null,
      status: {
        uploading: t('uploadModal.uploading'),
        uploaded: t('uploadModal.uploaded'),
        paused: t('uploadModal.paused'),
        canceled: t('uploadModal.canceled'),
        failed: t('uploadModal.failed'),
      },
      action: {
        pause: t('uploadModal.pause'),
        continue: t('uploadModal.continue'),
        cancel: t('uploadModal.cancel'),
        retry: t('uploadModal.retry'),
      },
    };

    this.refresh = this.refresh.bind(this);
    this.batchActions = this.batchActions.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
    this.formatBytes = this.formatBytes.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.uploadOneObject = this.uploadOneObject.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath, region } = this.props;
    dispatch(Actions.setHeader(t('objectManagement'), `${servicePath}/buckets`));

    dispatch(BucketActions.requestGetS3Domain(routerKey, region.regionId))
      .then(() => {
        AWS.config.endpoint = this.props.context.s3Domain;
        AWS.config.region = region.regionId;
        AWS.config.accessKeyId = region.accessKey;
        AWS.config.secretAccessKey = region.accessSecret;
        const s3 = new AWS.S3();
        this.setState({
          s3,
        }, () => this.initTable(routerKey, {}));
      });
  }

  refreshAction(routerKey, filters) {
    return ObjectActions.setVisibleObjects(this.state.s3, this.props.global.bucketName, routerKey, filters);
  }

  isBatchActionDisabled(availabeStatuss) {
    const instanceIds = _.keys(this.props.context.selected);
    const unavailabeInstances = this.props.context.objects.filter((instance) => {
      return instanceIds.indexOf(instance.instanceId) > -1 && availabeStatuss.indexOf(instance.status) === -1;
    });

    return !!unavailabeInstances.length;
  }

  batchActions(action) {
    const { dispatch, region, routerKey } = this.props;
    const objectNames = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(action(routerKey, region.regionId, objectNames))
        .then(() => {
          resolve();
          this.onRefresh({}, false)();
        }).catch(() => {
          reject();
        });
    });
  }

  onDelete() {
    const { t } = this.props;
    confirmModal(t('confirmDelete'), () => {
      return this.batchActions(ObjectActions.requestDeleteObjects);
    });
  }

  formatBytes(bytes) {
    if (bytes < 1024) return (bytes + 'B');
    else if (bytes < 1024 * 1024) return ((bytes / 1024).toFixed(1) + 'KB');
    else if (bytes < 1024 * 1024 * 1024) return ((bytes / 1024 / 1024).toFixed(1) + 'MB');
    else if (bytes < 1024 * 1024 * 1024 * 1024) return ((bytes / 1024 / 1024 / 1024).toFixed(1) + 'GB');
    return ((bytes / 1024 / 1024 / 1024 / 1024).toFixed(1) + 'TB');
  }

  onFileUpload() {
    const files = this.refs.fileUploader.files;

    const uploadingFileList = {};
    for (let i = 0, len = files.length; i < len; i++) {
      uploadingFileList[i] = {
        name: files[i].name,
        size: files[i].size,
        percent: 0,
        status: 'uploading',
        actions: [
          'pause',
          'cancel',
        ],
      };
    }

    this.setState({
      uploadingFileList,
    }, () => {
      this.refs.uploadModal.show();
      for (let i = 0, len = files.length; i < len; i++) {
        this.uploadOneObject(files[i], i);
      }
    });
  }

  uploadOneObject(file, index) {
    const fileName = file.name;
    const s3Uploader = this.state.s3.upload(
      {
        Bucket: this.props.global.bucketName,
        Key: fileName,
        Body: file,
      },
      {
        partSize: 5 * 1024 * 1024,
        queueSize: 10,
        leavePartsOnError: true,
      },
      (error, data) => {
        if (error) {
          if (error.code !== 'RequestAbortedError') {
            const newUploadingFileList = update(this.state.uploadingFileList, {
              [index]: { status: { $set: 'failed' } },
            });
            this.setState({
              uploadingFileList: newUploadingFileList,
            });
          }
        } else {
          let newUploadingFileList = update(this.state.uploadingFileList, {
            [index]: { status: { $set: 'uploaded' } },
          });
          newUploadingFileList = update(newUploadingFileList, {
            [index]: { percent: { $set: 0 } },
          });
          this.setState({
            uploadingFileList: newUploadingFileList,
          }, () => this.onRefresh({}, false)());
        }
      }
    );

    s3Uploader.on('httpUploadProgress', (progress) => {
      const percent = 100 * progress.loaded / progress.total;
      const newUploadingFileList = update(this.state.uploadingFileList, {
        [index]: { percent: { $set: percent } },
      });
      this.setState({
        uploadingFileList: newUploadingFileList,
      });
    });
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.visibleObjects.map((u) => { return u.name; }))} />
            </th>
            <th width="500">{t('fileName')}</th>
            <th width="200">{t('size')}</th>
            <th width="200">{t('category')}</th>
            <th width="400">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.visibleObjects.map((object) => {
            return (
              <tr key={object.Key}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(object.name)} checked={this.props.context.selected[object.name] === true} />
                </td>
                <td>
                  <Link to="#">
                    {object.Key}
                  </Link>
                </td>
                <td>{this.formatBytes(object.Size)}</td>
                <td>{}</td>
                <td>{moment.utc(object.creationDate).local().format('YYYY-MM-DD HH:mm:ss')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderHeader() {
    const { t, servicePath, params } = this.props;
    return (
      <div className="top-area">
        <div className="nav-text">
          <span>{t('bucket')}&nbsp;<i>{params.bucketName}</i></span>
        </div>
        <div className="nav-controls">
          <input
            className="btn btn-new"
            type="file"
            id="fileUploader"
            ref="fileUploader"
            multiple="true"
            style={{ display: 'none' }}
            onChange={this.onFileUpload}
          />
          <label htmlFor="fileUploader" style={{ marginRight: 10 }}>
            <div className="btn btn-new">
              <i className="fa fa-upload" />&nbsp;{t('uploadFile')}
            </div>
          </label>

          <Link className="btn btn-new" to={`${servicePath}/objects/create`}>
            <i className="fa fa-plus" />&nbsp;{t('createFolder')}
          </Link>
        </div>
        <Modal title={t('uploadModal.uploadingStatus')} ref="uploadModal" >
          <div>
            {this.state.uploadingFileList && <div className="content-wrapper">
              <div
                className="container-fluid container-limited"
                style={{
                  minHeight: 0,
                }}
              >
                <div className="content">
                  <div className="clearfix">
                    <div className="table-holder">
                      <table className="table">
                        <thead>
                          <tr>
                            <th width="400">{t('fileName')}</th>
                            <th width="200">{t('size')}</th>
                            <th width="200">{t('status')}</th>
                            <th width="200">{t('action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                        {Object.keys(this.state.uploadingFileList).map((key) => {
                          const file = this.state.uploadingFileList[key];
                          return (
                            <tr key={file.name}>
                              <td style={{ position: 'relative' }}>
                                <div>{file.name}</div>
                                <div
                                  style={{
                                    width: file.percent + '%',
                                    position: 'absolute',
                                    height: '100%',
                                    backgroundColor: '#0e90d2',
                                    top: 0,
                                    left: 0,
                                    opacity: 0.5,
                                  }}
                                ></div>
                              </td>
                              <td>{this.formatBytes(file.size)}</td>
                              <td>{this.state.status[file.status]}</td>
                              <td>{file.actions.map((action) => this.state.action[action])}</td>
                            </tr>
                          );
                        })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          </div>
        </Modal>
      </div>
    );
  }

  renderFilters() {
    const { t } = this.props;
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`} />
            </a>
          </div>

          <div className="filter-item inline">
            <input type="search" ref="search" placeholder={t('filterByObjectName')} className="form-control" onKeyPress={this.onSearchKeyPress} />
          </div>
        </div>
        {Object.keys(this.props.context.selected).length > 0 && <div>
          <div className="filter-item inline">
            {React.cloneElement(buttonForm(), {
              onSubmit: this.onDelete,
              text: t('delete'),
              type: 'btn-danger',
              disabled: this.isBatchActionDisabled(['active', 'stopped', 'error']), // TODO: modify disabled for available objects
            })}
          </div>
        </div>}
      </div>
    );
  }
}

export default attach(C);
