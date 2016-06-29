import React from 'react';
import Chart from 'react-c3-component';
import { generateLineChartConfig } from '../../shared/utils/chart';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import * as MonitorActions from '../redux/actions.monitor';

class C extends Page {

  constructor(props) {
    super(props);

    const { t } = this.props;

    this.periods = [{
      id: '120mins',
      name: t('periods.120mins'),
    }, {
      id: '720mins',
      name: t('periods.720mins'),
    }, {
      id: '48hours',
      name: t('periods.48hours'),
    }, {
      id: '14days',
      name: t('periods.14days'),
    }, {
      id: '30days',
      name: t('periods.30days'),
    }];

    this.metrics = [
      'cpu',
      'memory',
      'disk.io',
      'disk.iops',
      'disk.usage',
    ];

    this.state = {
      period: undefined,
    };

    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `/${region.regionId}/instances`));

    this.refresh('120mins')();
  }

  refresh(period) {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      const { dispatch, region, routerKey, instance } = this.props;

      this.metrics.forEach((metric) => {
        dispatch(MonitorActions.requestGetMonitor(routerKey, region.regionId, instance.instanceId, metric, period))
        .then(() => {
          dispatch(Actions.extendContext({ loading: false }, routerKey));
        });
      });

      this.setState({ period });

      dispatch(Actions.extendContext({ loading: true }, routerKey));
    };
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <div className="gray-content-block second-block">
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.refresh(this.state.period)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="filter-item inline pull-right">
            <div className="btn-group">
              {this.periods.map((period) => {
                return (
                  <a className={`btn ${period.id === this.state.period ? 'btn-info' : 'btn-default'}`} onClick={this.refresh(period.id)} key={period.id}>
                    {period.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 chart-panel">
            <span>{t('monitor.cpu')}</span>
            {this.props.context[`period-${this.state.period}-cpu`] && <Chart
              className="chart"
              config={generateLineChartConfig(this.props.context[`period-${this.state.period}-cpu`], {
                cpu_util: { name: t('monitor.cpu') },
              }, 'percentage')}
            />}
            {!this.props.context[`period-${this.state.period}-cpu`] && <div className="chart loading">
              <i className="fa fa-refresh fa-spin"></i>
            </div>}
          </div>
          <div className="col-md-6 chart-panel">
            <span>{t('monitor.memory')}</span>
            {this.props.context[`period-${this.state.period}-memory`] && <Chart
              className="chart"
              config={generateLineChartConfig(this.props.context[`period-${this.state.period}-memory`], {
                memory: { name: t('monitor.memory') },
                'memory.usage': { name: t('monitor.usage') },
              }, 'percentage')}
            />}
            {!this.props.context[`period-${this.state.period}-memory`] && <div className="chart loading">
              <i className="fa fa-refresh fa-spin"></i>
            </div>}
          </div>
          <div className="col-md-6 chart-panel">
            <span>{t('monitor.diskUsage')}</span>
            {this.props.context[`period-${this.state.period}-disk.usage`] && <Chart
              className="chart"
              config={generateLineChartConfig(this.props.context[`period-${this.state.period}-disk.usage`], {
                'disk.capacity': { name: t('monitor.capacity') },
                'disk.allocation': { name: t('monitor.allocation') },
              }, 'bytes')}
            />}
            {!this.props.context[`period-${this.state.period}-disk.usage`] && <div className="chart loading">
              <i className="fa fa-refresh fa-spin"></i>
            </div>}
          </div>
          <div className="col-md-6 chart-panel">
            <span>{t('monitor.diskIO')}</span>
            {this.props.context[`period-${this.state.period}-disk.io`] && <Chart
              className="chart"
              config={generateLineChartConfig(this.props.context[`period-${this.state.period}-disk.io`], {
                'disk.read.bytes.rate': { name: t('monitor.read') },
                'disk.write.bytes.rate': { name: t('monitor.write') },
              }, 'bytes')}
            />}
            {!this.props.context[`period-${this.state.period}-disk.io`] && <div className="chart loading">
              <i className="fa fa-refresh fa-spin"></i>
            </div>}
          </div>
          <div className="col-md-6 chart-panel">
            <span>{t('monitor.diskIOPS')}</span>
            {this.props.context[`period-${this.state.period}-disk.iops`] && <Chart
              className="chart"
              config={generateLineChartConfig(this.props.context[`period-${this.state.period}-disk.iops`], {
                'disk.read.requests.rate': { name: t('monitor.read') },
                'disk.write.requests.rate': { name: t('monitor.write') },
              })}
            />}
            {!this.props.context[`period-${this.state.period}-disk.iops`] && <div className="chart loading">
              <i className="fa fa-refresh fa-spin"></i>
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
