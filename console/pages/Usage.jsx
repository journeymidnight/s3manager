import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import * as QuotaActions from '../redux/actions.quota';

class C extends Page {

  initialize(routerKey) {
    const { t, dispatch, region, servicePath } = this.props;

    dispatch(Actions.setHeader(t('usageManage'), `${servicePath}/overview`));
    dispatch(QuotaActions.requestDescribeQuotas(region.regionId))
    .then(() => {
      dispatch(Actions.extendContext({ initialized: true }, routerKey));
    });
  }

  formatUsageDate(usage, total, resource) {
    let result;
    if (resource === 'memory') {
      result = <span>{Math.ceil(usage[resource] / 1024)}/{parseInt(total[resource] / 1024, 10)}</span>;
    } else {
      result = <span>{usage[resource]}/{total[resource]}</span>;
    }
    return result;
  }

  buildUsagePanelRows() {
    const { t, context } = this.props;
    const total = context.total;
    const usage = context.usage;
    const resourceList = ['instances', 'vcpus', 'memory', 'volumes', 'volumeSize', 'snapshots', 'images', 'eips', 'networks', 'keyPairs'];
    const rows = resourceList.map((resource) => {
      return (<div key={resource}>
        <div className="clearfix">
          <span>{t(`pageUsage.${resource}`)}</span>
          <span className="pull-right">{this.formatUsageDate(usage, total, resource)}</span>
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: `${usage[resource] * 100 / total[resource]}%` }}
          />
        </div>
      </div>);
    });
    return rows;
  }

  renderAfterInitialized() {
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                <span>{t('pageUsage.usage')}</span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="panel panel-default">
                  <div className="panel-body">
                    {this.buildUsagePanelRows()}
                  </div>
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
