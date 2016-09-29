import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Chart from 'react-c3-component';
import { generateAreaChartConfig } from '../../shared/utils/chart';

class FlowMonitor extends Component {

  componentWillMount() {
    this.props.changeMonitorType('flow');
  }

  render() {
    const { t, period, context } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-md-12 chart-panel">
            {period === '1day' && context.flowbyhour && !context.loading && <Chart
              className="chart"
              config={generateAreaChartConfig(this.props.combineYValue(this.props.getCompleteTime(context.flowbyhour).map((item) => {
                const newItem = { time: item.time };
                if (item.iptype === '1') {
                  newItem.flowOutPublic = item.flowout;
                  newItem.flowInPublic = item.flowin;
                }
                if (item.iptype === '0') {
                  newItem.flowOutPrivate = item.flowout;
                  newItem.flowInPrivate = item.flowin;
                }
                return newItem;
              }).map((item) => ({
                timestamp: Number(item.time),
                flowOutPublic: item.flowOutPublic || '0',
                flowInPublic: item.flowInPublic || '0',
                flowOutPrivate: item.flowOutPrivate || '0',
                flowInPrivate: item.flowInPrivate || '0',
              }))), {
                flowOutPublic: { name: t('pageBucket.flowOutPublic') },
                flowInPublic: { name: t('pageBucket.flowInPublic') },
                flowOutPrivate: { name: t('pageBucket.flowOutPrivate') },
                flowInPrivate: { name: t('pageBucket.flowInPrivate') },
              }, 'bytes')}
            />}

            {period !== '1day' && context.staticsbyday && !context.loading && <Chart
              className="chart"
              config={generateAreaChartConfig(context.staticsbyday.map((item) => ({
                timestamp: moment(item.date).utc(), // TODO: is date local or utc?
                flowOutPublic: item.flowOutPublic || '0',
                flowInPublic: item.flowInPublic || '0',
                flowOutPrivate: item.flowOutPrivate || '0',
                flowInPrivate: item.flowInPrivate || '0',
              })), {
                flowOutPublic: { name: t('pageBucket.flowOutPublic') },
                flowInPublic: { name: t('pageBucket.flowInPublic') },
                flowOutPrivate: { name: t('pageBucket.flowOutPrivate') },
                flowInPrivate: { name: t('pageBucket.flowInPrivate') },
              }, 'bytes')}
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

FlowMonitor.propTypes = {
  t: PropTypes.func,
  context: PropTypes.object,
  period: PropTypes.string,
  changeMonitorType: PropTypes.func,
  getCompleteTime: PropTypes.func,
  combineYValue: PropTypes.func,
  requestData: PropTypes.func,
};

export default FlowMonitor;
