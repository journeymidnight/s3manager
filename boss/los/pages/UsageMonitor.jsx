import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Chart, Loading } from '../../../lecloud-design';
import { generateLineChartConfig } from '../../../shared/utils/chart';

class UsageMonitor extends Component {

  componentWillMount() {
    this.props.changeMonitorType('usage');
  }

  render() {
    const { t, period, date, shouldAddTodayPoint, context } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-12 chart-panel" style={{ paddingTop: 25 }}>
            {(period === '1day' || period === 'someDay') && context.usagebyhour && !context.loading && <Chart
              className="chart"
              config={generateLineChartConfig((this.props.combineYValue(this.props.getCompleteTime(context.usagebyhour, date).map((item) => ({
                timestamp: Number(item.time),
                usage: item.usage || 0,
              })))), {
                usage: { name: t('pageBucket.usageLegend') },
              }, 'kilobytes')}
            />}

            {period !== '1day' && period !== 'someDay' && context.staticsbyday && context.usagebyhour && !context.loading && <Chart
              className="chart"
              config={generateLineChartConfig(context.staticsbyday.concat(
                shouldAddTodayPoint ?
                [{
                  date: moment().local().format('YYYYMMDD'),
                  usage: context.usagebyhour[context.usagebyhour.length - 1] ? context.usagebyhour[context.usagebyhour.length - 1].usage : 0,
                }] : []
              ).map((item) => ({
                timestamp: moment(item.date).utc(),
                usage: item.usage || 0,
              })), {
                usage: { name: t('pageBucket.usageLegend') },
              }, 'kilobytes')}
            />}

            {context.loading && <div className="chart">
              <Loading type="large" />
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
  date: PropTypes.object,
  shouldAddTodayPoint: PropTypes.bool,
  changeMonitorType: PropTypes.func,
  getCompleteTime: PropTypes.func,
  combineYValue: PropTypes.func,
  requestData: PropTypes.func,
};

export default UsageMonitor;
