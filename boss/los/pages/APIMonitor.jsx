import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Chart, Loading } from '../../../lecloud-design';
import { generateAreaChartConfig } from '../../../shared/utils/chart';

class APIMonitor extends Component {

  constructor() {
    super();

    this.getTodayOp = this.getTodayOp.bind(this);
  }

  componentWillMount() {
    this.props.changeMonitorType('api');
  }

  getTodayOp(opbyhourArray) {
    const opGetArray = opbyhourArray.filter(op => op.method === 'GET');
    const opPutArray = opbyhourArray.filter(op => op.method === 'PUT');
    const getOps = opGetArray.reduce((previousValue, currentItem) => (previousValue + Number(currentItem.count)), 0);
    const putOps = opPutArray.reduce((previousValue, currentItem) => (previousValue + Number(currentItem.count)), 0);
    return {
      date: moment().format('YYYYMMDD'),
      getOps,
      putOps,
    };
  }

  render() {
    const { t, period, date, shouldAddTodayPoint, context } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-md-12 chart-panel" style={{ paddingTop: 25 }}>
            {(period === '1day' || period === 'someDay') && context.opbyhour && !context.loading && <Chart
              className="chart"
              config={generateAreaChartConfig(this.props.combineYValue(this.props.getCompleteTime(context.opbyhour, date).map((item) => {
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

            {period !== '1day' && period !== 'someDay' && context.staticsbyday && context.opbyhour && !context.loading && <Chart
              className="chart"
              config={generateAreaChartConfig(context.staticsbyday.concat(
                shouldAddTodayPoint ?
                  [this.getTodayOp(context.opbyhour)] :
                  []
              ).map((item) => ({
                timestamp: moment(item.date).utc(),
                get: item.getOps || 0,
                put: item.putOps || 0,
              })), {
                get: { name: t('pageBucket.apiGet') },
                put: { name: t('pageBucket.apiPut') },
              }, 'count')}
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

APIMonitor.propTypes = {
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

export default APIMonitor;
