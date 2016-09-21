import _ from 'lodash';
import moment from 'moment';
import AWS from 'aws-sdk';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import { confirmModal } from '../../shared/components/Modal';
import { buttonForm } from '../../shared/forms/ButtonForm';
import TablePageStatic from '../../shared/pages/TablePageStatic';
import * as Actions from '../../console-common/redux/actions';
import * as ObjectActions from '../redux/actions.object';
import * as BucketActions from '../redux/actions.bucket';

class C extends TablePageStatic {

  constructor(props) {
    super(props);
    this.state = {
      s3: null,
    };

    this.refresh = this.refresh.bind(this);
    this.batchActions = this.batchActions.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
    this.formatBytes = this.formatBytes.bind(this);
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
        }, () => (this.initTable(routerKey, {})));
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
          <Link className="btn btn-new" to={`${servicePath}/objects/create`}>
            <i className="fa fa-upload" />&nbsp;{t('uploadFile')}
          </Link>

          <Link className="btn btn-new" to={`${servicePath}/objects/create`}>
            <i className="fa fa-plus" />&nbsp;{t('createFolder')}
          </Link>
        </div>
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
