import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Chart from 'react-c3-component';
import { generateAreaChartConfig } from '../../shared/utils/chart';

class APIMonitor extends Component {

  componentWillMount() {
    this.props.changeMonitorType('api');
  }

  render() {
    const { t, period, context } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-md-12 chart-panel">
            {period === '1day' && context.opbyhour && !context.loading && <Chart
              className="chart"
              config={generateAreaChartConfig(this.props.combineYValue(this.props.getCompleteTime(context.opbyhour).map((item) => {
                const newItem = { time: item.time };
                if (item.method === 'GET') {
                  newItem.get = item.count;
                }
                if (item.method === 'PUT') {
                  newItem.put = item.count;
                }
                return newItem;
              }).map((item) => ({
                timestamp: Number(item.time),
                get: item.get || 0,
                put: item.put || 0,
              }))), {
                get: { name: t('pageBucket.apiGet') },
                put: { name: t('pageBucket.apiPut') },
              }, 'count')}
            />}

            {period !== '1day' && context.staticsbyday && !context.loading && <Chart
              className="chart"
              config={generateAreaChartConfig(context.staticsbyday.map((item) => ({
                timestamp: moment(item.date).utc(), // TODO: is date local or utc?
                get: item.getOps || 0,
                put: item.putOps || 0,
              })), {
                get: { name: t('pageBucket.apiGet') },
                put: { name: t('pageBucket.apiPut') },
              }, 'count')}
            />}

            {context.loading && <div className="chart loading">
              <i className="fa fa-refresh fa-spin" />
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

APIMonitor.propTypes = {
  t: PropTypes.func,
  context: PropTypes.object,
  period: PropTypes.string,
  changeMonitorType: PropTypes.func,
  getCompleteTime: PropTypes.func,
  combineYValue: PropTypes.func,
  requestData: PropTypes.func,
};

export default APIMonitor;
