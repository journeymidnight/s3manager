import React from 'react';
import Chart from 'react-c3-component';
import { generateLineChartConfig } from '../../shared/utils/chart';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../../console-common/redux/actions';
import * as MonitorActions from '../redux/actions.monitor';

class C extends Page {

  constructor(props) {
    super(props);

    const { t } = this.props;

    this.periods = [{
      id: '120mins',
      name: t('monitor.periods.120mins'),
    }, {
      id: '720mins',
      name: t('monitor.periods.720mins'),
    }, {
      id: '48hours',
      name: t('monitor.periods.48hours'),
    }, {
      id: '14days',
      name: t('monitor.periods.14days'),
    }, {
      id: '30days',
      name: t('monitor.periods.30days'),
    }];

    this.metrics = [
      'volume.io',
      'volume.iops',
      'volume.usage',
    ];

    this.state = {
      period: undefined,
    };

    this.refresh = this.refresh.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('volumeManage'), `${servicePath}/volumes`));

    this.refresh('120mins')();
  }

  refresh(period) {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      const { dispatch, region, routerKey, volume } = this.props;

      dispatch(MonitorActions.requestGetMonitor(routerKey, region.regionId, volume.volumeId, this.metrics, period))
      .then(() => {
        dispatch(Actions.extendContext({ loading: false }, routerKey));
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
            <span>{t('monitor.diskUsage')}</span>
            {this.props.context[`period-${this.state.period}-volume.usage`] && <Chart
              className="chart"
              config={generateLineChartConfig(this.props.context[`period-${this.state.period}-volume.usage`].timeSeries, {
                total: { name: t('monitor.total') },
                used: { name: t('monitor.used') },
              }, 'bytes')}
            />}
            {!this.props.context[`period-${this.state.period}-volume.usage`] && <div className="chart loading">
              <i className="fa fa-refresh fa-spin"></i>
            </div>}
          </div>
          <div className="col-md-6 chart-panel">
            <span>{t('monitor.diskIO')}</span>
            {this.props.context[`period-${this.state.period}-volume.io`] && <Chart
              className="chart"
              config={generateLineChartConfig(this.props.context[`period-${this.state.period}-volume.io`].timeSeries, {
                read: { name: t('monitor.read') },
                write: { name: t('monitor.write') },
              }, 'bytes')}
            />}
            {!this.props.context[`period-${this.state.period}-volume.io`] && <div className="chart loading">
              <i className="fa fa-refresh fa-spin"></i>
            </div>}
          </div>
          <div className="col-md-6 chart-panel">
            <span>{t('monitor.diskIOPS')}</span>
            {this.props.context[`period-${this.state.period}-volume.iops`] && <Chart
              className="chart"
              config={generateLineChartConfig(this.props.context[`period-${this.state.period}-volume.iops`].timeSeries, {
                read: { name: t('monitor.read') },
                write: { name: t('monitor.write') },
              })}
            />}
            {!this.props.context[`period-${this.state.period}-volume.iops`] && <div className="chart loading">
              <i className="fa fa-refresh fa-spin"></i>
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
