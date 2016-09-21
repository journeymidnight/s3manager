import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import AWS from 'aws-sdk';
import Page, { attach } from '../../shared/pages/Page';
import BucketMonitors from './BucketMonitors';
import * as Actions from '../../console-common/redux/actions';
import * as BucketActions from '../redux/actions.bucket';

class C extends Page {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(BucketActions.removeBucket());
  }

  initialize() {
    const { t, dispatch, servicePath, region, routerKey, params } = this.props;
    dispatch(Actions.setHeader(t('bucketManage'), `${servicePath}/buckets`));
    const bucketName = params.bucketName;

    dispatch(BucketActions.requestGetS3Domain(routerKey, region.regionId))
      .then(() => {
        AWS.config.endpoint = this.props.context.s3Domain;
        AWS.config.region = region.regionId;
        AWS.config.accessKeyId = region.accessKey;
        AWS.config.secretAccessKey = region.accessSecret;
        const s3 = new AWS.S3();
        return dispatch(BucketActions.requestGetBucketAcl(s3, bucketName, routerKey));
      });

    const now = new Date();
    dispatch(Actions.extendContext({ monitorTimestamp: now }, routerKey));
    const nowTime = moment.utc(now).local().format('YYYYMMDDHHmmss');
    const todayBeginTime = moment.utc(now).local().format('YYYYMMDD000000');

    const today = moment.utc(now).local().format('YYYYMMDD');
    const firstDayOfMonth = moment.utc(now).local().format('YYYYMM01');

    Promise.all([
      dispatch(BucketActions.requestGetUsageByHour(routerKey, region.regionId, bucketName, todayBeginTime, nowTime)),
      dispatch(BucketActions.requestGetStaticsByDay(routerKey, region.regionId, bucketName, firstDayOfMonth, today)),
      dispatch(BucketActions.requestGetOpByHour(routerKey, region.regionId, bucketName, todayBeginTime, nowTime)),
      dispatch(BucketActions.requestGetFlowByHour(routerKey, region.regionId, bucketName, todayBeginTime, nowTime)),
    ])
      .then(() => {
        dispatch(Actions.extendContext({ loading: false }, routerKey));
      });

    dispatch(Actions.extendContext({ loading: true }, routerKey));
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
                            {(context.usagebyhour && context.usagebyhour.length > 0) ? (context.usagebyhour[context.usagebyhour.length - 1].usage / 1024).toFixed(1) : 0}MB
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageBucket.monthlyFlow')}</td>
                        <td>
                          <span>
                          {context.staticsbyday ? (context.staticsbyday.reduce((previousValue, currentItem) =>
                              (previousValue + Number(currentItem.flowInPrivate)
                              + Number(currentItem.flowOutPrivate)
                              + Number(currentItem.flowInPublic)
                              + Number(currentItem.flowOutPublic)
                              ), 0) / 1024).toFixed(1) : 0}MB
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageBucket.monthlyAPI')}</td>
                        <td>
                          <span>
                            {context.staticsbyday ? context.staticsbyday.reduce((previousValue, currentItem) =>
                                (previousValue + Number(currentItem.ops)
                                ), 0) : 0}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageBucket.createDate')}</td>
                        <td><span>{moment.utc(this.props.global.currentBucketCreationDate).local().format('YYYY-MM-DD HH:mm:ss')}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageBucket.configuration')}
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td>{t('pageBucket.bucketAcl')}</td>
                        <td>
                          <span>{context.acl}</span>
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
      </div>
    );
  }
}

export default attach(C);

