import _ from 'lodash';
import moment from 'moment';
import AWS from 'aws-sdk';
import React from 'react';
import update from 'react-addons-update';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import { buttonForm } from '../../shared/forms/ButtonForm';
import Modal, { confirmModal } from '../../shared/components/Modal';
import ObjectCreateForm from '../forms/ObjectCreateForm';
import ObjectPropertyForm from '../forms/ObjectPropertyForm';
import TablePageStatic from '../../shared/pages/TablePageStatic';
import SearchBox from '../../shared/components/SearchBox';
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
    this.checkFileDuplication = this.checkFileDuplication.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.uploadObjects = this.uploadObjects.bind(this);
    this.uploadOneObject = this.uploadOneObject.bind(this);
    this.handleUploadAction = this.handleUploadAction.bind(this);
    this.pauseOneObject = this.pauseOneObject.bind(this);
    this.continueOneObject = this.continueOneObject.bind(this);
    this.retryOneObject = this.retryOneObject.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onCancelUploading = this.onCancelUploading.bind(this);
    this.cancelOneObject = this.cancelOneObject.bind(this);
    this.onFileDownload = this.onFileDownload.bind(this);
    this.downloadOneObject = this.downloadOneObject.bind(this);
    this.checkObjectProperty = this.checkObjectProperty.bind(this);
    this.calProgressWidth = this.calProgressWidth.bind(this);
    this.changeFolder = this.changeFolder.bind(this);
    this.onCreateObject = this.onCreateObject.bind(this);
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
        this.initTable(routerKey, { searchWord: this.props.global.folderLocation });
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
            if (error.code === 'InvalidAccessKeyId' || error.code === 'NetworkingError') {
              window.location = '/';
            } else {
              dispatch(notifyAlert(error.message));
            }
          } else {
            dispatch(notify(t('objectDeletedSuccess')));
            this.onRefresh({ searchWord: this.props.global.folderLocation }, false)();
          }
        });
      }), folderName => dispatch(notifyAlert(folderName.slice(this.props.global.folderLocation.length, -1) + t('cannotDelete'))));
  }

  formatBytes(bytes) {
    if (bytes === 0) return 0;
    else if (bytes < 1024) return `${bytes}B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    else if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
    else if (bytes < 1024 * 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)}GB`;
    return `${(bytes / 1024 / 1024 / 1024 / 1024).toFixed(1)}TB`;
  }

  checkFileDuplication() {
    const files = this.refs.fileUploader.files;
    for (let i = 0, len = files.length; i < len; i++) {
      if (this.props.context.fileNames.includes(this.props.global.folderLocation + files[i].name)) {
        return true;
      }
    }
    return false;
  }

  onFileUpload() {
    if (this.checkFileDuplication()) {
      confirmModal(this.props.t('有重名文件，确认继续上传会覆盖原有文件。'), this.uploadObjects);
    } else {
      this.uploadObjects();
    }
  }

  uploadObjects() {
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
        if (error.code === 'InvalidAccessKeyId' || error.code === 'NetworkingError') {
          window.location = '/';
        } else if (error.code !== 'RequestAbortedError') {
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

  onClose() {
    if (Object.keys(this.state.uploadingFileList).find(key => this.state.uploadingFileList[key].status === 'uploading' || this.state.uploadingFileList[key].status === 'paused')) {
      const hidable = confirm(this.props.t('uploadModal.close'));
      if (hidable) {
        this.onCancelUploading();
        this.refs.uploadModal.hide();
      }
    } else {
      this.refs.uploadModal.hide();
    }
  }

  onCancelUploading() {
    for (let i = 0, len = Object.keys(this.state.uploadingFileList).length; i < len; i++) {
      this.cancelOneObject(i);
    }
  }

  cancelOneObject(index) {
    const s3Uploader = this.s3Uploaders[index];
    if (s3Uploader &&
      s3Uploader.service.config.params.UploadId &&
      (this.state.uploadingFileList[index].status === 'uploading' || this.state.uploadingFileList[index].status === 'paused')
    ) {
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

  onFileDownload() {
    const filenames = _.keys(this.props.context.selected);
    filenames.forEach(filename => {
      this.downloadOneObject(filename);
    });
  }

  downloadOneObject(filename, event) {
    if (event) {
      event.preventDefault();
    }

    const parser = document.createElement('a');
    parser.download = filename;
    parser.href = this.s3.getSignedUrl('getObject', { Bucket: this.props.params.bucketName, Key: filename, Expires: 60 * 60 * 24 }); // expires in 1 day

    parser.click();
  }

  checkObjectProperty(key) {
    const { routerKey, dispatch, params } = this.props;

    dispatch(extendContext({
      objectName: null,
      objectAcl: null,
      objectUrl: null,
    }, routerKey));

    dispatch(ObjectActions.requestGetObjectAcl(this.s3, params.bucketName, key, routerKey))
      .then(() => {
        const { context } = this.props;

        if (context.objectAcl === 'public-read') {
          const url = `http://${params.bucketName}.${context.s3Domain}/${context.objectName}`;
          dispatch(extendContext({ objectUrl: url }, routerKey));
        }
        setTimeout(() => this.refs.propertyModal.show(), 100);
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

  onCreateObject(values) {
    const { dispatch, t } = this.props;
    const params = {
      Bucket: this.props.params.bucketName,
      Key: `${this.props.global.folderLocation}${values.objectName}/`,
    };

    this.s3.putObject(params, (error) => {
      if (error) {
        if (error.code === 'InvalidAccessKeyId' || error.code === 'NetworkingError') {
          window.location = '/';
        } else {
          dispatch(notifyAlert(error.message));
        }
      } else {
        dispatch(notify(t('folderCreatedSuccess')));
        this.onRefresh({ searchWord: this.props.global.folderLocation }, false)();
        this.refs.folderModal.hide();
      }
    });
  }

  changeFolder(e, folderName) {
    e.preventDefault();
    this.refs.searchBox.refs.search.value = null;
    const { dispatch, routerKey } = this.props;
    dispatch(extendContext({ visibleObjects: [] }, routerKey));
    dispatch(ObjectActions.setFolderLocation(folderName));
    setTimeout(() => this.onRefresh({ searchWord: this.props.global.folderLocation }, false)(), 100);
  }

  renderTable() {
    const { t, context } = this.props;
    const { folderLocation } = this.props.global;
    return (
      <table className="table" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(context.visibleObjects.map((object) => object.Key || object.Prefix))}
                checked={this.isAllSelected(this.props.context.visibleObjects.map((object) => object.Key || object.Prefix))}
              />
            </th>
            <th style={{ width: '40%' }}>{t('objectName')}</th>
            <th>{t('size')}</th>
            <th>{t('category')}</th>
            <th style={{ width: '20%' }}>{t('created')}</th>
            <th>{t('action')}</th>
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
                <td
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <Link
                    to="#"
                    onClick={e => this.changeFolder(e, object.Prefix)}
                  >
                    {object.Prefix.startsWith(folderLocation) ? object.Prefix.slice(folderLocation.length, -1) : object.Prefix}
                  </Link>
                </td>
                <td>-</td>
                <td><i className="fa fa-folder-o" /></td>
                <td>-</td>
                <td>-</td>
              </tr> : <tr key={object.Key}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(object.Key)} checked={context.selected[object.Key] === true} />
                </td>
                <td
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <Link
                    to="#"
                    onClick={e => this.downloadOneObject(object.Key, e)}
                  >
                    {object.Key.startsWith(folderLocation) ? object.Key.slice(folderLocation.length) : object.Key}
                  </Link>
                </td>
                <td>{this.formatBytes(object.Size)}</td>
                <td>{object.Key.slice(object.Key.lastIndexOf('.') + 1)}</td>
                <td>{moment.utc(object.LastModified).local().format('YYYY-MM-DD HH:mm:ss')}</td>
                <td>
                  <a
                    href
                    onClick={e => {
                      e.preventDefault();
                      this.checkObjectProperty(object.Key);
                    }}
                  >
                    {t('property')}
                  </a>
                </td>
              </tr>);
          })}
        </tbody>
      </table>
    );
  }

  renderHeader() {
    const { t, params } = this.props;
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
            <i style={{ wordBreak: 'break-all' }}>
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

          <button className="btn btn-new" onClick={() => this.refs.folderModal.show()}>
            <i className="fa fa-plus" />&nbsp;{t('createFolder')}
          </button>
        </div>
        <Modal
          title={t('uploadModal.uploadingStatus')}
          ref="uploadModal"
          postponeClosing
          closingCb={this.onClose}
        >
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
                      <table className="table" style={{ tableLayout: 'fixed', marginBottom: 0 }}>
                        <thead>
                          <tr>
                            <th style={{ width: '40%' }}>{t('fileName')}</th>
                            <th style={{ width: '20%' }}>{t('uploadModal.progress')}</th>
                            <th style={{ width: '12%' }}>{t('size')}</th>
                            <th style={{ width: '14%' }}>{t('status')}</th>
                            <th style={{ width: '14%' }}>{t('action')}</th>
                          </tr>
                        </thead>
                      </table>
                      <div style={{ height: 300, overflowY: 'auto' }}>
                        <table className="table" style={{ tableLayout: 'fixed' }}>
                          <tbody>
                          {Object.keys(uploadingFileList).map((key) => {
                            const file = uploadingFileList[key];
                            return (
                              <tr key={file.name} style={{ width: '40%' }}>
                                <td
                                  style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >{file.name}
                                </td>
                                <td style={{ position: 'relative', width: '20%' }}>
                                  {this.calProgressWidth(file.percent)}
                                  <div
                                    style={{
                                      width: this.calProgressWidth(file.percent),
                                      position: 'absolute',
                                      height: '100%',
                                      backgroundColor: '#0e90d2',
                                      top: 0,
                                      left: 0,
                                      opacity: 0.5,
                                    }}
                                  ></div>
                                </td>
                                <td style={{ width: '12%' }}>{this.formatBytes(file.size)}</td>
                                <td style={{ width: '14%' }}>{this.status[file.status]}</td>
                                <td style={{ width: '14%' }}>
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
              </div>
            </div>}
          </div>
        </Modal>

        <Modal title={t('objectPropertyPage.property')} ref="propertyModal">
          <ObjectPropertyForm
            {...this.props}
            s3={this.s3}
          />
        </Modal>

        <Modal title={t('createFolder')} ref="folderModal">
          <ObjectCreateForm
            onSubmit={this.onCreateObject}
            folderNames={this.props.context.folderNames}
          />
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
            <a className="btn btn-default" onClick={e => this.doSearch(e, this.props.global.folderLocation)}>
              <i className={`fa fa-refresh ${context.loading ? 'fa-spin' : ''}`} />
            </a>
          </div>

          <div className="filter-item inline">
            <SearchBox
              ref="searchBox"
              placeholder={t('filterByObjectName')}
              onEnterPress={e => this.onSearchKeyPress(e, this.props.global.folderLocation)}
              onButtonClick={e => this.onSearchButtonClick(e, this.props.global.folderLocation)}
            />
          </div>
        </div>
        {Object.keys(context.selected).length > 0 &&
          <div className="filter-item inline">
            {React.cloneElement(buttonForm(), {
              onSubmit: this.onFileDownload,
              text: t('download'),
              type: 'btn-primary',
              disabled: (_.keys(context.selected).filter(key => key.endsWith('/')).length > 0),
            })}
          </div>}

        {Object.keys(context.selected).length > 0 &&
          <div className="filter-item inline">
            {React.cloneElement(buttonForm(), {
              onSubmit: this.onDelete,
              text: t('delete'),
              type: 'btn-danger',
            })}
          </div>}
      </div>
    );
  }
}

export default attach(ObjectManagement);
