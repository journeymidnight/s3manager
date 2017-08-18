import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Row, Col, Bar, Chart, Loading } from '../../../lecloud-design';
import { generateLineChartConfig, generateAreaChartConfig } from '../../../shared/utils/chart';

class C extends Component {

  constructor() {
    super();

    this.getCompleteTime = this.getCompleteTime.bind(this);
    this.combineYValue = this.combineYValue.bind(this);
    this.combine = this.combine.bind(this);
  }

  getCompleteTime(dataArray) {
    const nowLocal = this.props.context.monitorMomentLocal;
    const nowHourLocal = Number(moment(nowLocal).format('HH'));
    const startOfDayTimestampLocal = moment(nowLocal).startOf('day').valueOf();

    const idealHourArray = [];
    let hour = 0;
    while (hour <= nowHourLocal) {
      idealHourArray.push(hour);
      hour++;
    }

    const realHourArray = dataArray.map((data) => Number(moment.utc(Number(data.time)).local().format('HH')));
    const missingHourArray = idealHourArray.filter((time) => {
      return !realHourArray.includes(time);
    });

    return dataArray.concat(missingHourArray.map((time) => ({
      time: startOfDayTimestampLocal + time * 60 * 60 * 1000,
    })));
  }

  combine(data, nextData) {
    return (field) => {
      if (field !== 'timestamp' && nextData[field] !== 0) {
        data[field] = nextData[field];
      }
    };
  }

  combineYValue(dataArray) {
    let sortedDataArray = [];
    if (dataArray.length > 0) {
      sortedDataArray = dataArray.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
    }

    const combinedDataArray = [];
    for (let i = 0, len = sortedDataArray.length; i < len; i++) {
      if (sortedDataArray[i + 1] && sortedDataArray[i].timestamp === sortedDataArray[i + 1].timestamp) {
        const combinedData = sortedDataArray[i];
        while (sortedDataArray[i + 1] && sortedDataArray[i].timestamp === sortedDataArray[i + 1].timestamp) {
          Object.keys(combinedData).forEach(this.combine(combinedData, sortedDataArray[i + 1]));
          i++;
        }
        combinedDataArray.push(combinedData);
      } else {
        combinedDataArray.push(sortedDataArray[i]);
      }
    }
    return combinedDataArray;
  }

  render() {
    const { t, context } = this.props;
    return (
      <div>
        <Bar type="secondary">
          <button
            className="button button-icon"
            onClick={this.props.refresh}
          >
            <Loading loading={context.loading} />
          </button>
        </Bar>

        <Row style={{ borderBottom: 'solid 1px #ededf1' }}>
          <Col span={6}>
            <div className="chart-panel">
              <p className="chart-title">
                <span>{t('pageBucket.usageMonitor')}</span>
                <span className="pull-right text-muted">{t('pageBucket.monitorIntervalOneHour')}</span>
              </p>
              {context.usagebyhour && <Chart
                className="chart"
                config={generateLineChartConfig(this.combineYValue(this.getCompleteTime(context.usagebyhour).map((item) => ({
                  timestamp: Number(item.time),
                  usage: item.usage || 0,
                }))), {
                  usage: { name: t('pageBucket.usageLegend') },
                }, 'kilobytes')}
              />}
              {!context.usagebyhour && <div className="chart">
                <Loading type="large" />
              </div>}
            </div>
          </Col>
          <div className="chart-right-border" />
          <Col span={6}>
            <div className="chart-panel">
              <p className="chart-title">
                <span>{t('pageBucket.flowMonitor')}</span>
                <span className="pull-right text-muted">{t('pageBucket.monitorIntervalOneHour')}</span>
              </p>
              {context.flowbyhour && <Chart
                className="chart"
                config={generateAreaChartConfig(this.combineYValue(this.getCompleteTime(context.flowbyhour).map((item) => {
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
              {!context.flowbyhour && <div className="chart">
                <Loading type="large" />
              </div>}
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={6}>
            <div className="chart-panel">
              <p className="chart-title">
                <span>{t('pageBucket.apiMonitor')}</span>
                <span className="pull-right text-muted">{t('pageBucket.monitorIntervalOneHour')}</span>
              </p>
              {context.opbyhour && <Chart
                className="chart"
                config={generateAreaChartConfig(this.combineYValue(this.getCompleteTime(context.opbyhour).map((item) => {
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
              {!context.opbyhour && <div className="chart">
                <Loading type="large" />
              </div>}
            </div>
          </Col>
          <div className="chart-right-border" />
        </Row>
      </div>
    );
  }
}

C.propTypes = {
  t: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default C;
