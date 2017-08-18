import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import AWS from 'aws-sdk';
import { Link } from 'react-router';
import { attach } from '../../../shared/pages/Page';
import { CheckBox, Bar, Loading } from '../../../lecloud-design';
import { confirmModal } from '../../../lecloud-design/components/Modal/Modal';
import TablePageStatic from '../../../shared/pages/TablePageStatic';
import SearchBox from '../../../shared/components/SearchBox';
import { setHeader, notifyAlert } from '../../redux/actions';
import * as BucketActions from '../redux/actions.bucket';
import { requestGetS3Domain } from '../redux/actions.s3Domain';


class C extends TablePageStatic {

  constructor() {
    super();

    this.refresh = this.refresh.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath, region } = this.props;
    dispatch(setHeader(t('bucketList'), "buckets"));
    this.initTable(routerKey, {});
    dispatch(requestGetS3Domain(routerKey, region.regionId))
      .then(() => {
        AWS.config.endpoint = this.props.context.s3Domain;
        AWS.config.region = region.regionId;
        AWS.config.accessKeyId = region.accessKey;
        AWS.config.secretAccessKey = region.accessSecret;
        AWS.config.maxRetries = 3;
        this.s3 = new AWS.S3();
      });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return BucketActions.setVisibleBuckets(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { t, dispatch, region, routerKey } = this.props;
    const bucketName = _.keys(this.props.context.selected)[0];

    dispatch(BucketActions.isBucketEmpty(this.s3, bucketName))
      .then(() => confirmModal(t('confirmDelete'), () => {
        dispatch(BucketActions.requestDeleteBucket(routerKey, region.regionId, bucketName))
          .then(() => {
            this.onRefresh({}, false)();
          });
      }))
      .catch(bucket => {
        if (bucket) {
          dispatch(notifyAlert(bucket + t('cannotDelete'), 3000));
        }
      });
  }

  renderTable() {
    const { t, servicePath, context , service} = this.props;
    return context.total > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 54 }}>
              <CheckBox
                onClick={this.onSelectAll(context.visibleBuckets.map((u) => { return u.name; }))}
                isChecked={this.isAllSelected(this.props.context.visibleBuckets.map((u) => { return u.name; }))}
              />
            </th>

            <th style={{ width: '60%' }}>
              {t('bucketName')}
            </th>

            <th>
              {t('created')}
            </th>
          </tr>
        </thead>
        <tbody>
        {context.visibleBuckets.map((bucket) => {
          return (
            <tr key={bucket.name} className={context.selected[bucket.name] === true ? 'selected' : ''}>
              <td>
                <CheckBox onClick={this.onSelect(bucket.name)} isChecked={context.selected[bucket.name] === true} />
              </td>
              <td
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Link
                  to={`/buckets/${bucket.name}/detail?date=${moment.utc(bucket.creationDate)}`}
                >
                  {bucket.name}
                </Link>
              </td>
              <td>{moment.utc(bucket.creationDate).local().format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
      );
  }

  renderHeader() {
    const { t, servicePath , service,} = this.props;
    const {serviceKey} = service

    return (
      <Bar>
        <h2 className="bar-title">{t('bucketListDescription')}</h2>
        <div className="pull-right">
          <Link className="button" to={`/buckets/create`}>
            <i className="iconfont icon-create" />&nbsp;{t('create')}
          </Link>
        </div>
      </Bar>
    );
  }

  renderFilters() {
    const { t, context } = this.props;
    return (
      <Bar>
        {Object.keys(context.selected).length === 0 && <div>
          <button
            className="button button-icon"
            onClick={() => this.doSearch()}
          >
            <Loading loading={context.loading} />
          </button>
          <SearchBox
            ref="searchBox"
            placeholder={t('filterByBucketName')}
            onEnterPress={this.onSearchKeyPress}
            onButtonClick={this.onSearchButtonClick}
          />
        </div>}

        {Object.keys(context.selected).length > 0 && <button
          className="button button-red"
          type="button"
          onClick={this.onDelete}
          disabled={_.keys(context.selected).length > 1}
        >
          <i className="iconfont icon-remove" />
          &nbsp;
          {t('delete')}
        </button>}
      </Bar>
    );
  }
}

export default attach(C);
