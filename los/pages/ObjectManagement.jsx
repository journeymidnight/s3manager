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
        pause: 'fa-pause',
        continue: 'fa-play',
        cancel: 'fa-stop',
        retry: 'fa-upload',
      },
    };

    this.refresh = this.refresh.bind(this);
    this.batchActions = this.batchActions.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
    this.formatBytes = this.formatBytes.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.uploadOneObject = this.uploadOneObject.bind(this);
    this.handleUploadAction = this.handleUploadAction.bind(this);
    this.pauseOneObject = this.pauseOneObject.bind(this);
    this.continueOneObject = this.continueOneObject.bind(this);
    this.retryOneObject = this.retryOneObject.bind(this);
    this.cancelOneObject = this.cancelOneObject.bind(this);
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
    return ObjectActions.setVisibleObjects(this.state.s3, this.props.params.bucketName, routerKey, filters);
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
        s3Uploader: null,
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
        Bucket: this.props.params.bucketName,
        Key: fileName,
        Body: file,
      },
      {
        partSize: 5 * 1024 * 1024,
        queueSize: 10,
        leavePartsOnError: true,
      }
    );
    this.setState({
      uploadingFileList: update(this.state.uploadingFileList, {
        [index]: { s3Uploader: { $set: s3Uploader } },
      }),
    });

    s3Uploader.send(this.uploadOneObjectCb(index));
    s3Uploader.on('httpUploadProgress', (progress) => {
      const percent = 100 * progress.loaded / progress.total;
      console.log(percent);
      this.setState({
        uploadingFileList: update(this.state.uploadingFileList, {
          [index]: { percent: { $set: percent } },
        }),
      });
    });
  }

  uploadOneObjectCb(index) {
    return (error, data) => {
      if (error) {
        if (error.code !== 'RequestAbortedError') {
          let newUploadingFileList = update(this.state.uploadingFileList, {
            [index]: { status: { $set: 'failed' } },
          });
          newUploadingFileList = update(newUploadingFileList, {
            [index]: { percent: { $set: 0 } },
          });
          newUploadingFileList = update(newUploadingFileList, {
            [index]: { actions: { $set: ['retry'] } },
          });
          newUploadingFileList = update(newUploadingFileList, {
            [index]: { s3Uploader: { $set: null } },
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
        newUploadingFileList = update(newUploadingFileList, {
          [index]: { actions: { $set: [] } },
        });
        newUploadingFileList = update(newUploadingFileList, {
          [index]: { s3Uploader: { $set: null } },
        });
        this.setState({
          uploadingFileList: newUploadingFileList,
        }, () => this.onRefresh({}, false)());
      }
    };
  }

  handleUploadAction(action, index) {
    switch (action) {
      case 'pause':
        return this.pauseOneObject(index);
      case 'continue':
        return this.continueOneObject(index);
      case 'retry':
        return this.retryOneObject(index);
      case 'cancel':
        return this.cancelOneObject(index);
      default:
        return null;
    }
  }

  pauseOneObject(index) {
    this.state.uploadingFileList[index].s3Uploader.abort();

    let newUploadingFileList = update(this.state.uploadingFileList, {
      [index]: { status: { $set: 'paused' } },
    });
    newUploadingFileList = update(newUploadingFileList, {
      [index]: { actions: { $set: ['continue', 'cancel'] } },
    });
    console.log(this.state.uploadingFileList[index].s3Uploader === newUploadingFileList[index].s3Uploader)
    this.setState({
      uploadingFileList: newUploadingFileList,
    });
  }

  continueOneObject(index) {
    this.state.uploadingFileList[index].s3Uploader.send(this.uploadOneObjectCb(index));

    let newUploadingFileList = update(this.state.uploadingFileList, {
      [index]: { status: { $set: 'uploading' } },
    });
    newUploadingFileList = update(newUploadingFileList, {
      [index]: { actions: { $set: ['pause', 'cancel'] } },
    });
    console.log(this.state.uploadingFileList[index].s3Uploader === newUploadingFileList[index].s3Uploader)
    this.setState({
      uploadingFileList: newUploadingFileList,
    });
  }

  cancelOneObject(index) {
    const s3Uploader = this.state.uploadingFileList[index].s3Uploader;
    if (s3Uploader && s3Uploader.service.config.params.UploadId) {
      s3Uploader.service.abortMultipartUpload().send();
    }

    let newUploadingFileList = update(this.state.uploadingFileList, {
      [index]: { status: { $set: 'canceled' } },
    });
    newUploadingFileList = update(newUploadingFileList, {
      [index]: { percent: { $set: 0 } },
    });
    newUploadingFileList = update(newUploadingFileList, {
      [index]: { actions: { $set: ['retry'] } },
    });
    newUploadingFileList = update(newUploadingFileList, {
      [index]: { uploader: { $set: null } },
    });
    this.setState({
      uploadingFileList: newUploadingFileList,
    });
  }

  retryOneObject(index) {
    const file = this.refs.fileUploader.files[index];
    const fileName = file.name;
    const s3Uploader = this.state.s3.upload(
      {
        Bucket: this.props.params.bucketName,
        Key: fileName,
        Body: file,
      },
      {
        partSize: 5 * 1024 * 1024,
        queueSize: 10,
        leavePartsOnError: true,
      }
    );

    let newUploadingFileList = update(this.state.uploadingFileList, {
      [index]: { status: { $set: 'uploading' } },
    });
    newUploadingFileList = update(newUploadingFileList, {
      [index]: { actions: { $set: ['pause', 'cancel'] } },
    });
    newUploadingFileList = update(newUploadingFileList, {
      [index]: { s3Uploader: { $set: s3Uploader } },
    });
    this.setState({
      uploadingFileList: newUploadingFileList,
    });

    s3Uploader.send(this.uploadOneObjectCb(index));
    s3Uploader.on('httpUploadProgress', (progress) => {
      const percent = 100 * progress.loaded / progress.total;
      this.setState({
        uploadingFileList: update(this.state.uploadingFileList, {
          [index]: { percent: { $set: percent } },
        }),
      });
    });
  }

  renderTable() {
    const { t, params, servicePath } = this.props;
    return this.props.context.total > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.visibleObjects.map((object) => object.Key))} />
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
                  <input type="checkbox" className="selected" onChange={this.onSelect(object.Key)} checked={this.props.context.selected[object.Key] === true} />
                </td>
                <td>
                  <Link to={`${servicePath}/buckets/${params.bucketName}/objects`}>
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
          <form ref="uploaderForm">
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
              <div
                className="btn btn-new"
                onClick={() => {
                  this.refs.uploaderForm.reset();
                }}
              >
                <i className="fa fa-upload" />&nbsp;{t('uploadFile')}
              </div>
            </label>
          </form>

          <Link className="btn btn-new" to={`${servicePath}/buckets/${params.bucketName}/objects`}>
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
                              <td>
                                {
                                  file.actions.map((action, index) =>
                                    <i
                                      key={index}
                                      className={'fa ' + this.state.action[action]}
                                      style={{ marginRight: 10 }}
                                      onClick={
                                        () => this.handleUploadAction(action, key)
                                      }
                                    />
                                  )
                                }
                              </td>
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
