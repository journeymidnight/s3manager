import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import Chart from 'react-c3-component';
import DevOpsMonitor from './DevOpsMonitor.jsx';
import { generateAreaChartConfig, generateLineChartConfig, mergeTimeSeries } from '../../../shared/utils/chart';
import { attach } from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';
import * as DevOpsActions from '../../redux/actions.devops';

class C extends DevOpsMonitor {

  componentWillMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('boss.monitor.ceph'), '/devops/ceph'));
  }

  getMonitorData(dispatch, routerKey, region, period) {
    return dispatch(DevOpsActions.requestGetMonitorData(routerKey, region, period, {
      endpoints: ['ceph'],
      metrics: [
        'osd_num',
        'osd_up_num',
        'osd_in_num',
        'write_Bps',
        'recovery_Bps',
        'read_Bps',
        'total_byte',
        'used_byte',
        'data_byte',
        'avg_apply_latency_ms',
        'avg_commit_latency_ms',
        'stdev_apply_latency_ms',
        'stdev_commit_latency_ms',
        'pg_num',
        'healthy_pg',
        'op_per_sec',
      ],
      start: `${moment(new Date() - _.find(this.periods, (p) => { return p.id === period; }).duration * 1000).utc().format('YYYY-MM-DDTHH:mm:ss')}Z`,
      end: `${moment().utc().format('YYYY-MM-DDTHH:mm:ss')}Z`,
      aggregation: 'average',
    }));
  }

  renderMonitor() {
    const { t } = this.props;
    return (
      <div className="row">
        <div className="col-md-6 chart-panel">
          <span>{t('boss.monitor.cephOSDs')}</span>
          <span className="pull-right text-muted">{t(`boss.monitor.intervals.${this.state.period}`)}</span>

          {this.props.context[`period-${this.state.period}-ceph-osd_num`] && <Chart
            className="chart"
            config={generateAreaChartConfig(mergeTimeSeries(
              ['osd_num', this.props.context[`period-${this.state.period}-ceph-osd_num`].timeSeries],
              ['osd_in_num', this.props.context[`period-${this.state.period}-ceph-osd_in_num`].timeSeries],
              ['osd_up_num', this.props.context[`period-${this.state.period}-ceph-osd_up_num`].timeSeries]
            ), {
              osd_num: { name: t('boss.monitor.cephOSDs') },
              osd_in_num: { name: t('boss.monitor.cephOSDIns') },
              osd_up_num: { name: t('boss.monitor.cephOSDUps') },
            })}
          />}
          {!this.props.context[`period-${this.state.period}-ceph-osd_num`] && <div className="chart loading">
            <i className="fa fa-refresh fa-spin"></i>
          </div>}
        </div>

        <div className="col-md-6 chart-panel">
          <span>{t('boss.monitor.cephPGs')}</span>
          <span className="pull-right text-muted">{t(`boss.monitor.intervals.${this.state.period}`)}</span>
          {this.props.context[`period-${this.state.period}-ceph-pg_num`] && <Chart
            className="chart"
            config={generateAreaChartConfig(this.props.context[`period-${this.state.period}-ceph-pg_num`].timeSeries, {
              value: { name: t('boss.monitor.cephPGs') },
            })}
          />}
          {!this.props.context[`period-${this.state.period}-ceph-pg_num`] && <div className="chart loading">
            <i className="fa fa-refresh fa-spin"></i>
          </div>}
        </div>

        <div className="col-md-12 chart-panel">
          <span>{t('boss.monitor.cephCapacity')}</span>
          <span className="pull-right text-muted">{t(`boss.monitor.intervals.${this.state.period}`)}</span>
          {this.props.context[`period-${this.state.period}-ceph-total_byte`] && <Chart
            className="chart"
            config={generateLineChartConfig(mergeTimeSeries(
              ['total_byte', this.props.context[`period-${this.state.period}-ceph-total_byte`].timeSeries],
              ['used_byte', this.props.context[`period-${this.state.period}-ceph-used_byte`].timeSeries]
            ), {
              total_byte: { name: t('boss.monitor.cephTotal') },
              used_byte: { name: t('boss.monitor.cephUsed') },
            }, 'bytes')}
          />}
          {!this.props.context[`period-${this.state.period}-ceph-total_byte`] && <div className="chart loading">
            <i className="fa fa-refresh fa-spin"></i>
          </div>}
        </div>
      </div>
    );
  }
}

export default attach(C);
