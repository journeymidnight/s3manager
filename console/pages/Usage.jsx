import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import * as QuotaActions from '../redux/actions.quota';

class C extends Page {

  componentDidMount() {
    const { routerKey, dispatch, region } = this.props;
    dispatch(QuotaActions.requestDescribeQuotas(region.regionId))
      .then(() => {
        dispatch(Actions.extendContext({ initialized: true }, routerKey));
      });
  }

  renderAfterInitialized() {
    const { t, context } = this.props;
    const total = context.total;
    const usage = context.usage;
    const resourceList = Object.keys(total);
    const rowCount = resourceList.length % 2 === 0 ? parseInt(resourceList.length / 2, 10) : parseInt(resourceList.length / 2, 10) + 1;
    let usagePanelRows = [];
    for (let i = 0; i < rowCount; i++) {
      usagePanelRows.push(
        <div className="row" key={i}>
          {resourceList.slice(i * 2, i * 2 + 2).map((resource) => {
            return (<div className="col-md-6 usage-panel-container" key={resource}>
              <div className="resource-usage-panel">
                <div className="usage-title">
                  <span>{t(`pageUsage.${resource}`)}</span>
                </div>
                <div className="usage-chart">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: `${usage[resource] * 100 / total[resource]}%` }}
                    />
                  </div>
                </div>
                <div className="usage-data">
                  <span>{usage[resource]}/{total[resource]}</span>
                </div>
              </div>
            </div>);
          })}
        </div>
      );
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            {usagePanelRows}
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
