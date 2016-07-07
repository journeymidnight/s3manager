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
          <div className="col-md-6 usage-panel-container">
            <div className="resource-usage-panel">
              <div className="usage-title">
                <span>{t(`pageUsage.${resourceList[i * 2]}`)}</span>
              </div>
              <div className="usage-chart">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: `${usage[resourceList[i * 2]] * 100 / total[resourceList[i * 2]]}%` }}
                  />
                </div>
              </div>
              <div className="usage-data">
                <span>{usage[resourceList[i * 2]]}/{total[resourceList[i * 2]]}</span>
              </div>
            </div>
          </div>
          {!(resourceList.length % 2 !== 0 && i === rowCount - 1) && <div className="col-md-6 usage-panel-container">
            <div className="resource-usage-panel">
              <div className="usage-title">
                <span>{t(`pageUsage.${resourceList[i * 2 + 1]}`)}</span>
              </div>
              <div className="usage-chart">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: `${usage[resourceList[i * 2 + 1]] * 100 / total[resourceList[i * 2 + 1]]}%` }}
                  />
                </div>
              </div>
              <div className="usage-data">
                <span>{usage[resourceList[i * 2 + 1]]}/{total[resourceList[i * 2 + 1]]}</span>
              </div>
            </div>
          </div>}
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
