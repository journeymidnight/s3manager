import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Chart from 'react-c3-component';
import { generateAreaChartConfig } from '../../shared/utils/chart';

class FlowMonitor extends Component {

  constructor() {
    super();

    this.getTodayFlow = this.getTodayFlow.bind(this);
  }

  componentWillMount() {
    this.props.changeMonitorType('flow');
  }

  getTodayFlow(flowbyhourArray) {
    const flowPublicArray = flowbyhourArray.filter(flow => flow.iptype === '1');
    const flowPrivateArray = flowbyhourArray.filter(flow => flow.iptype === '0');
    const flowOutPublic = flowPublicArray.reduce((previousValue, currentItem) => (previousValue + Number(currentItem.flowout)), 0);
    const flowInPublic = flowPublicArray.reduce((previousValue, currentItem) => (previousValue + Number(currentItem.flowin)), 0);
    const flowOutPrivate = flowPrivateArray.reduce((previousValue, currentItem) => (previousValue + Number(currentItem.flowout)), 0);
    const flowInPrivate = flowPrivateArray.reduce((previousValue, currentItem) => (previousValue + Number(currentItem.flowin)), 0);
    return {
      date: moment().format('YYYYMMDD'),
      flowOutPublic,
      flowInPublic,
      flowOutPrivate,
      flowInPrivate,
    };
  }

  render() {
    const { t, period, shouldAddTodayPoint, context } = this.props;
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

            {period !== '1day' && context.staticsbyday && context.flowbyhour && !context.loading && <Chart
              className="chart"
              config={generateAreaChartConfig(context.staticsbyday.concat(
                shouldAddTodayPoint ?
                  [this.getTodayFlow(context.flowbyhour)] :
                  []
              ).map((item) => ({
                timestamp: moment(item.date).utc(),
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
  shouldAddTodayPoint: PropTypes.bool,
  period: PropTypes.string,
  changeMonitorType: PropTypes.func,
  getCompleteTime: PropTypes.func,
  combineYValue: PropTypes.func,
  requestData: PropTypes.func,
};

export default FlowMonitor;
