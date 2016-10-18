import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import AWS from 'aws-sdk';
import Page, { attach } from '../../shared/pages/Page';
import BucketMonitors from './BucketMonitors';
import Modal from '../../shared/components/Modal';
import BucketPutAclForm from '../forms/BucketPutAclForm';
import { requestGetS3Domain } from '../redux/actions.s3Domain';
import { setHeader, extendContext } from '../../console-common/redux/actions';
import * as BucketActions from '../redux/actions.bucket';
import { removeFolderLocation } from '../redux/actions.object';

class C extends Page {

  constructor(props) {
    super(props);

    const { t } = this.props;
    this.acl = {
      private: t('pageBucketCreate.aclPrivate'),
      'public-read': t('pageBucketCreate.aclPublicR'),
    };

    this.formatBytes = this.formatBytes.bind(this);
    this.onPutAcl = this.onPutAcl.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath, region, routerKey, params } = this.props;
    dispatch(setHeader(t('bucketDetail'), `${servicePath}/buckets`));
    const bucketName = params.bucketName;

    dispatch(requestGetS3Domain(routerKey, region.regionId))
      .then(() => {
        AWS.config.endpoint = this.props.context.s3Domain;
        AWS.config.region = region.regionId;
        AWS.config.accessKeyId = region.accessKey;
        AWS.config.secretAccessKey = region.accessSecret;
        this.s3 = new AWS.S3();
        dispatch(BucketActions.requestGetBucketAcl(this.s3, bucketName, routerKey));
      });

    const nowLocal = moment();
    dispatch(extendContext({ monitorMomentLocal: nowLocal }, routerKey));
    const nowLocalFormat = moment(nowLocal).format('YYYYMMDDHHmmss');

    const startOfDayLocalFormat = moment(nowLocal).startOf('day').format('YYYYMMDDHHmmss');
    const todayLocalFormat = moment(nowLocal).format('YYYYMMDD');
    const startOfMonthLocalFormat = moment(nowLocal).startOf('month').format('YYYYMMDD');

    Promise.all([
      dispatch(BucketActions.requestGetUsageByHour(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat)),
      dispatch(BucketActions.requestGetStaticsByDay(routerKey, region.regionId, bucketName, startOfMonthLocalFormat, todayLocalFormat)),
      dispatch(BucketActions.requestGetOpByHour(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat)),
      dispatch(BucketActions.requestGetFlowByHour(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat)),
      dispatch(BucketActions.requestGetUsageByNow(routerKey, region.regionId, bucketName, this.props.global.project.projectId)), // TODO: change regionId
    ])
      .then(() => {
        dispatch(extendContext({ loading: false }, routerKey));
      });

    dispatch(extendContext({ loading: true }, routerKey));
    if (this.props.global.folderLocation) {
      dispatch(removeFolderLocation());
    }
  }

  formatBytes(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    else if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
    else if (bytes < 1024 * 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)}GB`;
    return `${(bytes / 1024 / 1024 / 1024 / 1024).toFixed(1)}TB`;
  }

  onPutAcl(values) {
    const { acl } = values;
    const { dispatch, params, routerKey } = this.props;
    dispatch(BucketActions.requestPutBucketAcl(this.s3, params.bucketName, acl))
      .then(() => {
        this.refs.aclModal.hide();
        dispatch(BucketActions.requestGetBucketAcl(this.s3, params.bucketName, routerKey));
      });
  }

  render() {
    const { t, servicePath, params, context } = this.props;

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                <span>{t('bucket')}&nbsp;<i>{params.bucketName}</i></span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageBucket.basicInfo')}
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td width="100">{t('pageBucket.usage')}</td>
                        <td>
                          <span>
                            {context.usageByNow ?
                              this.formatBytes(Number(context.usageByNow) * 1024)
                              : 0}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageBucket.monthlyFlow')}</td>
                        <td>
                          <span>
                          {(context.staticsbyday && context.flowbyhour) ?
                            this.formatBytes(context.staticsbyday.reduce((previousValue, currentItem) =>
                              (previousValue + Number(currentItem.flowInPrivate)
                              + Number(currentItem.flowOutPrivate)
                              + Number(currentItem.flowInPublic)
                              + Number(currentItem.flowOutPublic)
                              ), 0)
                            + context.flowbyhour.reduce((previousValue, currentItem) =>
                              (previousValue + Number(currentItem.flowout)
                                + Number(currentItem.flowin)
                              ), 0))
                            : 0}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageBucket.monthlyAPI')}</td>
                        <td>
                          <span>
                            {(context.staticsbyday && context.opbyhour) ?
                            context.staticsbyday.reduce((previousValue, currentItem) =>
                                (previousValue + Number(currentItem.ops)
                                ), 0)
                            + context.opbyhour.reduce((previousValue, currentItem) =>
                              (previousValue + Number(currentItem.count)
                              ), 0)
                              : 0}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageBucket.createDate')}</td>
                        <td><span>{moment.utc(this.props.global.bucketCreationDate).local().format('YYYY-MM-DD HH:mm:ss')}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageBucket.configuration')}
                    <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars" />
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="btn-page-action"
                            onClick={() => this.refs.aclModal.show()}
                          >
                            {t('pageBucket.putAcl')}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td width="100">{t('pageBucket.bucketAcl')}</td>
                        <td>
                          <span>{this.acl[context.acl]}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageBucket.loggingService')}</td>
                        <td>
                          <span>test</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageBucket.publicDomain')}</td>
                        <td>
                          <span>{params.bucketName}.{context.s3Domain}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageBucket.privateDomain')}</td>
                        <td>
                          <span>test</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-8 tabs">
                <ul className="nav-links clearfix">
                  <li className="pull-left active">
                    <Link data-placement="left" to={`${servicePath}/buckets/${params.bucketName}`}>
                      {t('pageBucket.monitor')}
                    </Link>
                  </li>
                </ul>
                <div>
                  <BucketMonitors {...this.props} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal title={t('pageBucket.putAcl')} ref="aclModal">
          <BucketPutAclForm onSubmit={this.onPutAcl} />
        </Modal>
      </div>
    );
  }
}

export default attach(C);

