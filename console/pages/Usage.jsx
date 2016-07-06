import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';

class C extends Page {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(Actions.extendContext({ initialized: true }));
  }

  renderAfterInitialized() {
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="row">
              <div className="col-md-6 usage-panel-container">
                <div className="resource-usage-panel">
                  <div className="usage-title">
                    <span>云硬盘</span>
                  </div>
                  <div className="usage-chart">
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{ width: '60%' }}>
                      </div>
                    </div>
                  </div>
                  <div className="usage-data">
                    <span>1/5</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 usage-panel-container">
                <div className="resource-usage-panel">
                  <div className="usage-title">
                    <span>云硬盘</span>
                  </div>
                  <div className="usage-chart">
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{ width: '60%' }}>
                      </div>
                    </div>
                  </div>
                  <div className="usage-data">
                    <span>1/5</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 usage-panel-container">
                <div className="resource-usage-panel">
                  <div className="usage-title">
                    <span>云硬盘</span>
                  </div>
                  <div className="usage-chart">
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{ width: '60%' }}>
                      </div>
                    </div>
                  </div>
                  <div className="usage-data">
                    <span>1/5</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 usage-panel-container">
                <div className="resource-usage-panel">
                  <div className="usage-title">
                    <span>云硬盘</span>
                  </div>
                  <div className="usage-chart">
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{ width: '60%' }}>
                      </div>
                    </div>
                  </div>
                  <div className="usage-data">
                    <span>1/5</span>
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
