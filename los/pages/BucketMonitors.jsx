import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Chart from 'react-c3-component';
import { generateLineChartConfig, generateAreaChartConfig } from '../../shared/utils/chart';

class C extends Component {
  constructor() {
    super();

    this.getCompleteTime = this.getCompleteTime.bind(this);
    this.combineYValue = this.combineYValue.bind(this);
  }

  getCompleteTime(dataArray) {
    const nowHour = Number(moment.utc(this.context.monitorTimestamp).local().format('HH'));
    const todayDate = moment.utc(this.context.monitorTimestamp).local().format('YYYY/MM/DD');
    const todayBeginTimestamp = new Date(todayDate).getTime();

    const idealTimeArray = [];
    let hour = 1;
    while (hour <= nowHour) {
      idealTimeArray.push(hour);
      hour++;
    }
    const realTimeArray = dataArray.map((data) => Number(moment.utc(Number(data.time)).local().format('HH')));
    const supplementaryTimeArray = idealTimeArray.filter((time) => {
      return !realTimeArray.includes(time);
    });

    return dataArray.concat(supplementaryTimeArray.map((time) => ({
      time: todayBeginTimestamp + time * 60 * 60 * 1000,
    })));
  }

  combineYValue(dataArray) {
    let sortedDataArray = [];
    if (dataArray.length > 0) {
      sortedDataArray = dataArray.sort((a, b) => {
        return a.time - b.time;
      });
    }

    const combinedDataArray = [];
    for (let i = 0, len = sortedDataArray.length; i < len; i++) {
      if (sortedDataArray[i].time === sortedDataArray[i + 1].time) {
        combinedDataArray.push(Object.assign({}, sortedDataArray[i]), sortedDataArray[i + 1]);
        i++;
      } else {
        combinedDataArray.push(Object.assign({}, sortedDataArray[i]));
      }
    }
    return combinedDataArray;
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <div className="gray-content-block second-block">
          <div className="filter-item inline">
            <a className="btn btn-default">
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`} />
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 chart-panel">
            <span>{t('pageBucket.usageMonitor')}</span>
            <span className="pull-right text-muted">{t('pageBucket.monitorIntervalOneHour')}</span>
            {this.props.context.usagebyhour && <Chart
              className="chart"
              config={generateLineChartConfig(this.getCompleteTime(this.props.context.usagebyhour).map((item) => {
                const newItem = Object.assign({}, item, {
                  timestamp: moment.utc(Number(item.time)).format('YYYY-MM-DDTHH:mm:ss'),
                });
                delete newItem.time;
                newItem.usage = newItem.usage || '0';
                return newItem;
              }), {
                usage: { name: t('pageBucket.usageLegend') },
              }, 'kilobytes')}
            />}
            {!this.props.context.usagebyhour && <div className="chart loading">
              <i className="fa fa-refresh fa-spin" />
            </div>}
          </div>

          <div className="col-md-6 chart-panel">
            <span>{t('pageBucket.flowMonitor')}</span>
            <span className="pull-right text-muted">{t('pageBucket.monitorIntervalOneHour')}</span>
            {this.props.context.flowbyhour && <Chart
              className="chart"
              config={generateAreaChartConfig(this.combineYValue(this.getCompleteTime(this.props.context.flowbyhour).map((item) => {
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
              }).map((item) => {
                const newItem = { timestamp: moment.utc(Number(item.time)).format('YYYY-MM-DDTHH:mm:ss') };
                newItem.flowOutPublic = item.flowOutPublic || '0';
                newItem.flowInPublic = item.flowInPublic || '0';
                newItem.flowOutPrivate = item.flowOutPrivate || '0';
                newItem.flowInPrivate = item.flowInPrivate || '0';
                return newItem;
              })), {
                flowOutPublic: { name: t('pageBucket.flowOutPublic') },
                flowInPublic: { name: t('pageBucket.flowInPublic') },
                flowOutPrivate: { name: t('pageBucket.flowOutPrivate') },
                flowInPrivate: { name: t('pageBucket.flowInPrivate') },
              }, 'bytes')}
            />}
            {!this.props.context.flowbyhour && <div className="chart loading">
              <i className="fa fa-refresh fa-spin" />
            </div>}
          </div>

          <div className="col-md-6 chart-panel">
            <span>{t('pageBucket.apiMonitor')}</span>
            <span className="pull-right text-muted">{t('pageBucket.monitorIntervalOneHour')}</span>
            {this.props.context.opbyhour && <Chart
              className="chart"
              config={generateAreaChartConfig(this.combineYValue(this.getCompleteTime(this.props.context.opbyhour).map((item) => {
                const newItem = { time: item.time };
                if (item.method === 'GET') {
                  newItem.get = item.count;
                }
                if (item.method === 'PUT') {
                  newItem.put = item.count;
                }
                return newItem;
              }).map((item) => {
                const newItem = { timestamp: moment.utc(Number(item.time)).format('YYYY-MM-DDTHH:mm:ss') };
                newItem.get = item.get || 0;
                newItem.put = item.put || 0;
                return newItem;
              })), {
                get: { name: t('pageBucket.apiGet') },
                put: { name: t('pageBucket.apiPut') },
              }, 'count')}
            />}
            {!this.props.context.opbyhour && <div className="chart loading">
              <i className="fa fa-refresh fa-spin" />
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

C.propTypes = {
  t: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};

export default C;
