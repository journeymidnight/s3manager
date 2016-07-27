import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import Chart from 'react-c3-component';
import { generateLineChartConfig } from '../../../shared/utils/chart';
import Page, { attach } from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';
import * as DevOpsActions from '../../redux/actions.devops';

class C extends Page {

  constructor(props) {
    super(props);

    const { t } = this.props;

    this.periods = [{
      id: '120mins',
      duration: 60 * 60 * 2,
      name: t('boss.monitor.periods.120mins'),
    }, {
      id: '720mins',
      duration: 60 * 60 * 12,
      name: t('boss.monitor.periods.720mins'),
    }, {
      id: '48hours',
      duration: 60 * 60 * 24 * 2,
      name: t('boss.monitor.periods.48hours'),
    }, {
      id: '14days',
      duration: 60 * 60 * 24 * 7,
      name: t('boss.monitor.periods.14days'),
    }, {
      id: '30days',
      duration: 60 * 60 * 24 * 30,
      name: t('boss.monitor.periods.30days'),
    }];

    this.state = {
      period: undefined,
    };

    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('boss.monitor.ceph'), '/devops/ceph'));

    this.refresh('120mins')();
  }

  refresh(period) {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      const { dispatch, routerKey, region2 } = this.props;

      dispatch(DevOpsActions.requestGetMonitorData(routerKey, region2, period, {
        endpoints: ['ceph'],
        metrics: ['osd_num'],
        start: `${moment(new Date() - _.find(this.periods, (p) => { return p.id === period; }).duration * 1000).utc().format('YYYY-MM-DDTHH:mm:ss')}Z`,
        end: `${moment().utc().format('YYYY-MM-DDTHH:mm:ss')}Z`,
        aggregation: 'average',
      }))
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
      <div className="content">
        <div className="clearfix">

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
              <span>{t('boss.monitor.cephOSDs')}</span>
              <span className="pull-right text-muted">{t(`boss.monitor.intervals.${this.state.period}`)}</span>

              {this.props.context[`period-${this.state.period}-ceph-osd_num`] && <Chart
                className="chart"
                config={generateLineChartConfig(this.props.context[`period-${this.state.period}-ceph-osd_num`].timeSeries, {
                  value: { name: t('boss.monitor.cephOSDs') },
                })}
              />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
