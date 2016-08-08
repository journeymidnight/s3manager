import React from 'react';
import Time from 'react-time';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import * as Actions from '../redux/actions';
import * as ActivityActions from '../redux/actions.activity';

class C extends TablePage {

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('activityManage'), `${servicePath}/activities`));

    this.initTable(routerKey, { status: ['pending', 'running', 'finished', 'error'] });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return ActivityActions.requestDescribeJobs(routerKey, region.regionId, filters);
  }

  getResourceUrl(resourceId) {
    const { servicePath } = this.props;
    const mapKey = resourceId.split('-')[0];
    const map = {
      i: 'instances',
      net: 'networks',
      snt: 'subnets',
      v: 'volumes',
      img: 'images',
      snapshot: 'snapshots',
      eip: 'eips',
      kp: 'key_pairs',
    };
    return `${servicePath}/${map[mapKey]}/${resourceId}`;
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.jobSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th>{t('action')}</th>
            <th>{t('resource')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.jobSet.map((job) => {
            return (
              <tr key={job.jobId}>
                <td>
                  {t(`actionTranslation.${job.action}`)}
                </td>
                <td>
                  <Link to={this.getResourceUrl(job.resourceIds[0])}>{job.resourceIds[0]}</Link>
                </td>
                <td className={`i-status i-status-${job.status}`}>
                  <i className="icon"></i>
                  {t(`jobStatus.${job.status}`)}
                </td>
                <td className="light"><Time value={job.created} format="YYYY-MM-DD HH:mm:ss" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderHeader() {
    const { t } = this.props;
    return (
      <div className="top-area">
        <div className="nav-text">
          <span className="light">
            {t('activityManageDescription')}
          </span>
        </div>
      </div>
    );
  }
}

export default attach(C);
