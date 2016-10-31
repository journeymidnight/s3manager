import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Chart from 'react-c3-component';
import { generateLineChartConfig } from '../../shared/utils/chart';

class UsageMonitor extends Component {

  componentWillMount() {
    this.props.changeMonitorType('usage');
  }

  render() {
    const { t, period, context } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-md-12 chart-panel">
            {period === '1day' && context.usagebyhour && !context.loading && <Chart
              className="chart"
              config={generateLineChartConfig(context.usagebyhour.map((item) => ({
                timestamp: Number(item.time),
                usage: item.usage || 0,
              })), {
                usage: { name: t('pageBucket.usageLegend') },
              }, 'kilobytes')}
            />}

            {period !== '1day' && context.staticsbyday && context.usagebyhour && !context.loading && <Chart
              className="chart"
              config={generateLineChartConfig(context.staticsbyday.concat([{
                date: moment().local().format('YYYYMMDD'),
                usage: context.usagebyhour.pop().usage,
              }]).map((item) => ({
                timestamp: moment(item.date).utc(),
                usage: item.usage || 0,
              })), {
                usage: { name: t('pageBucket.usageLegend') },
              }, 'kilobytes')}
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

UsageMonitor.propTypes = {
  t: PropTypes.func,
  context: PropTypes.object,
  period: PropTypes.string,
  changeMonitorType: PropTypes.func,
  getCompleteTime: PropTypes.func,
  combineYValue: PropTypes.func,
  requestData: PropTypes.func,
};

export default UsageMonitor;
