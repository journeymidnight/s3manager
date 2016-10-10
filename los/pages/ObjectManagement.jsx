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
import { setHeader, notify, notifyAlert, extendContext } from '../../console-common/redux/actions';
import { requestGetS3Domain } from '../redux/actions.s3Domain';
import * as ObjectActions from '../redux/actions.object';

class ObjectManagement extends TablePageStatic {

  constructor(props) {
    super(props);
    const { t } = this.props;
    this.state = {};
    this.status = {
      uploading: t('uploadModal.uploading'),
      uploaded: t('uploadModal.uploaded'),
      paused: t('uploadModal.paused'),
      canceled: t('uploadModal.canceled'),
      failed: t('uploadModal.failed'),
    };
    this.actions = {
      pause: 'fa-pause',
      continue: 'fa-play',
      cancel: 'fa-stop',
      retry: 'fa-upload',
    };

    this.refresh = this.refresh.bind(this);
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
    this.calProgressWidth = this.calProgressWidth.bind(this);
    this.changeFolder = this.changeFolder.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath, region } = this.props;
    dispatch(setHeader(t('objectManagement'), `${servicePath}/buckets`));
    if (!this.props.global.folderLocation) {
      dispatch(ObjectActions.setFolderLocation(''));
    }

    dispatch(requestGetS3Domain(routerKey, region.regionId))
      .then(() => {
        AWS.config.endpoint = this.props.context.s3Domain;
        AWS.config.region = region.regionId;
        AWS.config.accessKeyId = region.accessKey;
        AWS.config.secretAccessKey = region.accessSecret;
        this.s3 = new AWS.S3();
        this.initTable(routerKey, {}, { searchWord: this.props.global.folderLocation });
      });
  }

  refreshAction(routerKey, filters) {
    return ObjectActions.setVisibleObjects(this.s3, this.props.params.bucketName, routerKey, filters);
  }

  onDelete() {
    const { t, dispatch } = this.props;
    const objectKeys = _.keys(this.props.context.selected);
    Promise.all(objectKeys.filter((key) => key.endsWith('/')).map((folderName) => dispatch(ObjectActions.isFolderEmpty(this.s3, this.props.params.bucketName, folderName))))
      .then(() => confirmModal(t('confirmDelete'), () => {
        const params = {
          Bucket: this.props.params.bucketName,
          Delete: {
            Objects: objectKeys.map((key) => ({ Key: key })),
            Quiet: true,
          },
        };

        this.s3.deleteObjects(params, (error) => {
          if (error) {
            dispatch(notifyAlert(error.message)); // will there be error.message?
          } else {
            dispatch(notify(t('objectDeletedSuccess')));
            this.onRefresh({ searchWord: this.props.global.folderLocation }, false)();
          }
        });
      }), folderName => dispatch(notifyAlert(folderName.slice(this.props.global.folderLocation.length, -1) + t('cannotDeleteFolder'))));
  }

  formatBytes(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    else if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
    else if (bytes < 1024 * 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)}GB`;
    return `${(bytes / 1024 / 1024 / 1024 / 1024).toFixed(1)}TB`;
  }

  onFileUpload() {
    const files = this.refs.fileUploader.files;
    const uploadingFileList = {};
    this.s3Uploaders = [];
    for (let i = 0, len = files.length; i < len; i++) {
      uploadingFileList[i] = {
        name: files[i].name,
        size: files[i].size,
        percent: 0,
        status: 'uploading',
        actions: ['pause'],
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
    const fileName = this.props.global.folderLocation + file.name;
    const s3Uploader = this.s3.upload(
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
    this.s3Uploaders[index] = s3Uploader;

    s3Uploader.send(this.uploadOneObjectCb(index));
    s3Uploader.on('httpUploadProgress', (progress) => {
      if (!progress.target) { // Sometimes ProgressEvent is passed as the parameter, this statement is to rule it out. TODO: figure out why
        const percent = 100 * progress.loaded / progress.total;
        this.setState({
          uploadingFileList: update(this.state.uploadingFileList, {
            [index]: { percent: { $set: percent } },
          }),
        });
      }
    });
  }

  uploadOneObjectCb(index) {
    return (error) => {
      if (error) {
        if (error.code !== 'RequestAbortedError') {
          this.s3Uploaders[index] = null;
          const newUploadingFile = Object.assign({}, this.state.uploadingFileList[index], {
            status: 'failed',
            percent: 0,
            actions: ['retry'],
          });
          this.setState({
            uploadingFileList: update(this.state.uploadingFileList, {
              [index]: { $set: newUploadingFile },
            }),
          });
        }
      } else {
        this.onRefresh({ searchWord: this.props.global.folderLocation }, false)();
        this.s3Uploaders[index] = null;
        const newUploadingFile = Object.assign({}, this.state.uploadingFileList[index], {
          status: 'uploaded',
          percent: 'complete',
          actions: [],
        });
        this.setState({
          uploadingFileList: update(this.state.uploadingFileList, {
            [index]: { $set: newUploadingFile },
          }),
        });
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
    this.s3Uploaders[index].abort();

    const newUploadingFile = Object.assign({}, this.state.uploadingFileList[index], {
      status: 'paused',
      actions: ['continue', 'cancel'], // Cancel action will only appear after pause because cancelling while uploading usually result in error. TODO: figure out why
    });
    this.setState({
      uploadingFileList: update(this.state.uploadingFileList, {
        [index]: { $set: newUploadingFile },
      }),
    });
  }

  continueOneObject(index) {
    this.s3Uploaders[index].send(this.uploadOneObjectCb(index));

    const newUploadingFile = Object.assign({}, this.state.uploadingFileList[index], {
      status: 'uploading',
      actions: ['pause'],
    });

    this.setState({
      uploadingFileList: update(this.state.uploadingFileList, {
        [index]: { $set: newUploadingFile },
      }),
    });
  }

  cancelOneObject(index) {
    const s3Uploader = this.s3Uploaders[index];
    if (s3Uploader && s3Uploader.service.config.params.UploadId) {
      s3Uploader.service.abortMultipartUpload().send();
    }
    this.s3Uploaders[index] = null;

    const newUploadingFile = Object.assign({}, this.state.uploadingFileList[index], {
      status: 'canceled',
      percent: 0,
      actions: ['retry'],
    });

    this.setState({
      uploadingFileList: update(this.state.uploadingFileList, {
        [index]: { $set: newUploadingFile },
      }),
    });
  }

  retryOneObject(index) {
    const file = this.refs.fileUploader.files[index];
    this.uploadOneObject(file, index);
    const newUploadingFile = Object.assign({}, this.state.uploadingFileList[index], {
      status: 'uploading',
      percent: 0,
      actions: ['pause'],
    });
    this.setState({
      uploadingFileList: update(this.state.uploadingFileList, {
        [index]: { $set: newUploadingFile },
      }),
    });
  }

  calProgressWidth(percent) {
    /* Paused and continued uploading will bring more uploaded bytes than total bytes, resulting percent > 100%.
     * The thick here is to hold the percent at 99% until uploading finish.
     * TODO: find better solution
     */
    if (percent <= 99) return `${percent.toFixed(0)}%`;
    if (percent === 'complete') return '100%';
    return '99%';
  }

  changeFolder(e, folderName) {
    e.preventDefault();
    this.refs.search.value = null;
    const { dispatch, routerKey } = this.props;
    dispatch(extendContext({ visibleObjects: [] }, routerKey));
    dispatch(ObjectActions.setFolderLocation(folderName));
    setTimeout(() => this.onRefresh({ searchWord: this.props.global.folderLocation }, false)(), 100);
  }

  renderTable() {
    const { t, params, servicePath, context } = this.props;
    const { folderLocation } = this.props.global;
    return (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(context.visibleObjects.map((object) => object.Key))} />
            </th>
            <th width="600">{t('objectName')}</th>
            <th width="200">{t('size')}</th>
            <th width="200">{t('category')}</th>
            <th width="300">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {folderLocation.length > 0 && <tr>
            <td />
            <td>
              <Link
                to="#"
                onClick={e => this.changeFolder(e, folderLocation.slice(0, folderLocation.lastIndexOf('/', folderLocation.length - 2) + 1))}
              >
                {t('returnUpFolder')}
              </Link>
            </td>
            <td />
            <td />
            <td />
          </tr>}

          {context.visibleObjects.map((object) => {
            return (
              object.Prefix ? <tr key={object.Prefix}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(object.Prefix)} checked={context.selected[object.Prefix] === true} />
                </td>
                <td>
                  <Link
                    to="#"
                    style={{
                      wordBreak: 'break-word',
                    }}
                    onClick={e => this.changeFolder(e, object.Prefix)}
                  >
                    {object.Prefix.startsWith(folderLocation) ? object.Prefix.slice(folderLocation.length, -1) : object.Prefix}
                  </Link>
                </td>
                <td />
                <td><i className="fa fa-folder-o" /></td>
                <td />
              </tr> :
              <tr key={object.Key}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(object.Key)} checked={context.selected[object.Key] === true} />
                </td>
                <td>
                  <Link
                    to={`${servicePath}/buckets/${params.bucketName}/objects`}
                    style={{
                      wordBreak: 'break-word',
                    }}
                  >
                    {object.Key.startsWith(folderLocation) ? object.Key.slice(folderLocation.length) : object.Key}
                  </Link>
                </td>
                <td>{this.formatBytes(object.Size)}</td>
                <td />
                <td>{moment.utc(object.LastModified).local().format('YYYY-MM-DD HH:mm:ss')}</td>
              </tr>);
          })}
        </tbody>
      </table>
    );
  }

  renderHeader() {
    const { t, servicePath, params } = this.props;
    const { folderLocation } = this.props.global;
    const { uploadingFileList } = this.state;
    return (
      <div className="top-area">
        <div className="nav-text">
          {folderLocation.length === 0 ? <span>
            {t('bucket')}
            &nbsp;
            <i>
              {params.bucketName}
            </i>
          </span> : <span>
            {t('folder')}
            &nbsp;
            <i>
              {folderLocation}
            </i>
          </span>}
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

          <Link className="btn btn-new" to={`${servicePath}/buckets/${params.bucketName}/objects/create`}>
            <i className="fa fa-plus" />&nbsp;{t('createFolder')}
          </Link>
        </div>
        <Modal title={t('uploadModal.uploadingStatus')} ref="uploadModal" >
          <div>
            {uploadingFileList && <div className="content-wrapper">
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
                            <th width="600">{t('fileName')}</th>
                            <th width="200">{t('size')}</th>
                            <th width="200">{t('status')}</th>
                            <th width="200">{t('action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                        {Object.keys(uploadingFileList).map((key) => {
                          const file = uploadingFileList[key];
                          return (
                            <tr key={file.name}>
                              <td style={{ position: 'relative' }}>
                                <div
                                  style={{
                                    paddingRight: '50px',
                                    wordBreak: 'break-word',
                                  }}
                                >{file.name}</div>
                                <div
                                  style={{
                                    width: '100%',
                                    position: 'absolute',
                                    height: '100%',
                                    top: 0,
                                    left: 0,
                                    textAlign: 'right',
                                    padding: '10px 16px',
                                    verticalAlign: 'middle',
                                  }}
                                >{this.calProgressWidth(file.percent)}</div>
                                <div
                                  style={{
                                    width: this.calProgressWidth(file.percent),
                                    position: 'absolute',
                                    height: '100%',
                                    backgroundColor: '#0e90d2',
                                    top: 0,
                                    left: 0,
                                    opacity: 0.5,
                                    textAlign: 'right',
                                  }}
                                ></div>
                              </td>
                              <td>{this.formatBytes(file.size)}</td>
                              <td>{this.status[file.status]}</td>
                              <td>
                                {
                                  file.actions.map((action, index) =>
                                    <i
                                      key={index}
                                      className={`fa ${this.actions[action]}`}
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
    const { t, context } = this.props;
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${context.loading ? 'fa-spin' : ''}`} />
            </a>
          </div>

          <div className="filter-item inline">
            <input type="search" ref="search" placeholder={t('filterByObjectName')} className="form-control" onKeyPress={e => this.onSearchKeyPress(e, this.props.global.folderLocation)} />
          </div>
        </div>
        {Object.keys(context.selected).length > 0 && <div>
          <div className="filter-item inline">
            {React.cloneElement(buttonForm(), {
              onSubmit: this.onDelete,
              text: t('delete'),
              type: 'btn-danger',
            })}
          </div>
        </div>}
      </div>
    );
  }
}

export default attach(ObjectManagement);
