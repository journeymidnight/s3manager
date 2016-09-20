import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Chart from 'react-c3-component';
import { generateLineChartConfig, generateAreaChartConfig } from '../../shared/utils/chart';

class C extends Component {
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
              config={generateLineChartConfig(this.props.context.usagebyhour.map((item) => {
                const newItem = Object.assign({}, item, { timestamp: moment.utc(Number(item.time)).format('YYYY-MM-DDTHH:mm:ss') });
                delete newItem.time;
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
              config={generateAreaChartConfig(this.props.context.flowbyhour.map((item) => {
                const newItem = Object.assign({}, item, { timestamp: moment.utc(Number(item.time)).format('YYYY-MM-DDTHH:mm:ss') });
                delete newItem.time;
                return newItem;
              }), {
                flowOutPublic: { name: t('pageBucket.flowOutPublic') },
                flowInPublic: { name: t('pageBucket.flowInPublic') },
                flowOutPrivate: { name: t('pageBucket.flowOutPrivate') },
                flowInPrivate: { name: t('pageBucket.flowInPrivate') },
              }, 'kilobytes')}
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
              config={generateAreaChartConfig(this.props.context.opbyhour.map((item) => {
                const newItem = Object.assign({}, item, { timestamp: moment.utc(Number(item.time)).format('YYYY-MM-DDTHH:mm:ss') });
                delete newItem.time;
                return newItem;
              }), {
                get: { name: t('pageBucket.apiGet') },
                put: { name: t('pageBucket.apiPut') },
              }, '')}
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
  t: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
};

export default C;
