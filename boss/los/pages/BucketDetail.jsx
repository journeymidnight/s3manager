import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import AWS from 'aws-sdk';
import Page, { attach } from '../../../shared/pages/Page';
import BucketMonitors from './BucketMonitors';
import BucketPutAclForm from '../forms/BucketPutAclForm';
//import { Bar, Row, Col, Panel, Dropdown, Menu, Modal } from '../../../lecloud-design';
import { Bar, Row, Col, Panel, Menu, Modal , Dropdown} from '../../../lecloud-design';
import { requestGetS3Domain } from '../redux/actions.s3Domain';
import { setHeader, extendContext } from '../../redux/actions';
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

    this.refresh = this.refresh.bind(this);
    this.formatBytes = this.formatBytes.bind(this);
    this.onPutAcl = this.onPutAcl.bind(this);
    this.onClosePutAcl = this.onClosePutAcl.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(setHeader(t('bucketDetail'), `${servicePath}/buckets`));
    this.refresh();
  }

  refresh() {
    const { dispatch, region, routerKey, params } = this.props;
    const bucketName = params.bucketName;

    dispatch(requestGetS3Domain(routerKey, region.regionId))
      .then(() => {
        AWS.config.endpoint = this.props.context.s3Domain;
        AWS.config.region = region.regionId;
        AWS.config.accessKeyId = region.accessKey;
        AWS.config.secretAccessKey = region.accessSecret;
        AWS.config.maxRetries = 3;
        this.s3 = new AWS.S3();
        dispatch(BucketActions.requestGetBucketAcl(this.s3, bucketName, routerKey));
      });

    const nowLocal = moment();
    dispatch(extendContext({ monitorMomentLocal: nowLocal }, routerKey));
    const nowLocalFormat = moment(nowLocal).format('YYYYMMDDHH0030');

    const startOfDayLocalFormat = moment(nowLocal).startOf('day').format('YYYYMMDDHHmmss');
    const todayLocalFormat = moment(nowLocal).format('YYYYMMDD');
    const startOfMonthLocalFormat = moment(nowLocal).startOf('month').format('YYYYMMDD');

    Promise.all([
    //  dispatch(BucketActions.requestGetUsageByHour(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat)),
    //  dispatch(BucketActions.requestGetStaticsByDay(routerKey, region.regionId, bucketName, startOfMonthLocalFormat, todayLocalFormat)),
    //  dispatch(BucketActions.requestGetOpByHour(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat)),
    //  dispatch(BucketActions.requestGetFlowByHour(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat)),
    dispatch(BucketActions.requestGetUsageByNow(routerKey, undefined, bucketName, undefined)), // TODO: change regionId
    ])
    .then(() => {
      dispatch(extendContext({ loading: false }, routerKey));
    });

    dispatch(extendContext({ loading: true }, routerKey));
    //if (this.props.global.folderLocation) {
    //  dispatch(removeFolderLocation());
    //}
  }

  formatBytes(bytes) {
    if (bytes === 0) return 0;
    else if (bytes < 1024) return `${bytes}B`;
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
        this.refs.aclModal.close();
        dispatch(BucketActions.requestGetBucketAcl(this.s3, params.bucketName, routerKey));
      });
  }

  onClosePutAcl() {
    this.refs.aclModal.close();
  }

  render() {
    const { t, servicePath, params, context } = this.props;

    return (
      <div className="full-height">
        <Bar>
          <h2 className="bar-title">{t('bucket')}&nbsp;<i>{params.bucketName}</i></h2>
        </Bar>

        <Row className="full-height">
          <Col span={1} style={{ width: '28.6%' }}>
            <Panel title={t('pageBucket.basicInfo')}>
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: 100 }}>{t('pageBucket.usage')}</td>
                    <td>
                      <span>
                        {context.usageByNow ?
                          this.formatBytes(Number(context.usageByNow) * 1024)
                          : 0}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>{t('pageBucket.createDate')}</td>
                    <td><span>{moment(Number(this.props.location.query.date)).local().format('YYYY-MM-DD HH:mm:ss')}</span></td>
                  </tr>
                </tbody>
              </table>
            </Panel>

            <Panel
              title={t('pageBucket.configuration')}
              action={
                <Dropdown type="button" trigger="click" align="right">
                  <Menu>
                    <Menu.Item
                      key={0}
                    >
                      <a
                        href
                        onClick={(e) => {
                          e.preventDefault();
                          this.refs.aclModal.open();
                        }}
                      >
                        {t('pageBucket.putAcl')}
                      </a>

                    </Menu.Item>
                  </Menu>
                </Dropdown>
              }
            >
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: 100 }}>{t('pageBucket.bucketAcl')}</td>
                    <td>
                      <span>{this.acl[context.acl]}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{t('pageBucket.publicDomain')}</td>
                    <td>
                      <span>{params.bucketName}.{context.s3Domain}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Panel>
          </Col>

          
        </Row>

        <Modal title={t('pageBucket.putAcl')} ref="aclModal">
          <BucketPutAclForm onSubmit={this.onPutAcl} closeForm={this.onClosePutAcl} />
        </Modal>
      </div>
    );
  }
}

export default attach(C);

