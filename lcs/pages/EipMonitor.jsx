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
      'eip.traffic',
      'eip.packets',
    ];

    this.state = {
      period: undefined,
    };

    this.refresh = this.refresh.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('eipManage'), `${servicePath}/eips`));

    this.refresh('120mins')();
  }

  refresh(period) {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      const { dispatch, region, routerKey, eip } = this.props;

      dispatch(MonitorActions.requestGetMonitor(routerKey, region.regionId, eip.eipId, this.metrics, period))
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
            <span>{t('monitor.networkTraffic')}</span>
            <span className="pull-right text-muted">{t(`monitor.intervals.${this.state.period}`)}</span>
            {this.props.context[`period-${this.state.period}-eip.traffic`] && <Chart
              className="chart"
              config={generateLineChartConfig(this.props.context[`period-${this.state.period}-eip.traffic`].timeSeries, {
                in: { name: t('monitor.in') },
                out: { name: t('monitor.out') },
              }, 'bps')}
            />}
            {!this.props.context[`period-${this.state.period}-eip.traffic`] && <div className="chart loading">
              <i className="fa fa-refresh fa-spin"></i>
            </div>}
          </div>
          <div className="col-md-6 chart-panel">
            <span>{t('monitor.networkPackets')}</span>
            <span className="pull-right text-muted">{t(`monitor.intervals.${this.state.period}`)}</span>
            {this.props.context[`period-${this.state.period}-eip.packets`] && <Chart
              className="chart"
              config={generateLineChartConfig(this.props.context[`period-${this.state.period}-eip.packets`].timeSeries, {
                in: { name: t('monitor.in') },
                out: { name: t('monitor.out') },
              }, 'packets/s')}
            />}
            {!this.props.context[`period-${this.state.period}-eip.packets`] && <div className="chart loading">
              <i className="fa fa-refresh fa-spin"></i>
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
