import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import Chart from 'react-c3-component';
import DevOpsMonitor from './DevOpsMonitor.jsx';
import { generateStepChartConfig, mergeTimeSeries } from '../../../shared/utils/chart';
import { attach } from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';
import * as DevOpsActions from '../../redux/actions.devops';

class C extends DevOpsMonitor {

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('boss.monitor.openstack'), '/devops/openstack'));
  }

  getMonitorData(dispatch, routerKey, region, period) {
    return dispatch(DevOpsActions.requestGetMonitorData(routerKey, region, period, {
      endpoints: ['openstack'],
      metrics: [
        'keystone',
        'keystone_service',
        'cinder',
        'glance',
        'neutron',
        'nova_os',
        'missing-queues',
        'queues-items',
        'queues-without-consumers',
        'missing-nodes',
        'services_offline_nova',
        'services_online_nova',
        'services_offline_cinder',
        'token_count',
        'instance_error',
        'instance_count',
        'cpu_total',
        'cpu_used',
        'ram_total',
        'ram_used',
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
        <div className="col-md-12 chart-panel">
          <span>{t('boss.monitor.openstackAPIs')}</span>
          <span className="pull-right text-muted">{t(`boss.monitor.intervals.${this.state.period}`)}</span>

          {this.props.context[`period-${this.state.period}-openstack-keystone`] && <Chart
            className="chart"
            config={generateStepChartConfig(mergeTimeSeries(
              ['keystone', this.props.context[`period-${this.state.period}-openstack-keystone`].timeSeries],
              ['keystone_service', this.props.context[`period-${this.state.period}-openstack-keystone_service`].timeSeries],
              ['cinder', this.props.context[`period-${this.state.period}-openstack-cinder`].timeSeries],
              ['glance', this.props.context[`period-${this.state.period}-openstack-glance`].timeSeries],
              ['neutron', this.props.context[`period-${this.state.period}-openstack-neutron`].timeSeries],
              ['nova_os', this.props.context[`period-${this.state.period}-openstack-nova_os`].timeSeries]
            ), {
              keystone: { name: t('boss.monitor.openstackKeystone') },
              keystone_service: { name: t('boss.monitor.openstackKeystoneService') },
              cinder: { name: t('boss.monitor.openstackCinder') },
              glance: { name: t('boss.monitor.openstackGlance') },
              neutron: { name: t('boss.monitor.openstackNeutron') },
              nova_os: { name: t('boss.monitor.openstackNovaOS') },
            })}
          />}
          {!this.props.context[`period-${this.state.period}-openstack-keystone`] && <div className="chart loading">
            <i className="fa fa-refresh fa-spin"></i>
          </div>}
        </div>

        <div className="col-md-6 chart-panel">
          <span>{t('boss.monitor.CPU')}</span>
          <span className="pull-right text-muted">{t(`boss.monitor.intervals.${this.state.period}`)}</span>

          {this.props.context[`period-${this.state.period}-openstack-cpu_total`] && <Chart
            className="chart"
            config={generateStepChartConfig(mergeTimeSeries(
              ['cpu_total', this.props.context[`period-${this.state.period}-openstack-cpu_total`].timeSeries],
              ['cpu_used', this.props.context[`period-${this.state.period}-openstack-cpu_used`].timeSeries]
            ), {
              cpu_total: { name: t('boss.monitor.CPUTotal') },
              cpu_used: { name: t('boss.monitor.CPUUsed') },
            })}
          />}
          {!this.props.context[`period-${this.state.period}-openstack-cpu_total`] && <div className="chart loading">
            <i className="fa fa-refresh fa-spin"></i>
          </div>}
        </div>

        <div className="col-md-6 chart-panel">
          <span>{t('boss.monitor.RAM')}</span>
          <span className="pull-right text-muted">{t(`boss.monitor.intervals.${this.state.period}`)}</span>

          {this.props.context[`period-${this.state.period}-openstack-ram_total`] && <Chart
            className="chart"
            config={generateStepChartConfig(mergeTimeSeries(
              ['ram_total', this.props.context[`period-${this.state.period}-openstack-ram_total`].timeSeries],
              ['ram_used', this.props.context[`period-${this.state.period}-openstack-ram_used`].timeSeries]
            ), {
              ram_total: { name: t('boss.monitor.RAMTotal') },
              ram_used: { name: t('boss.monitor.RAMUsed') },
            }, 'bytes')}
          />}
          {!this.props.context[`period-${this.state.period}-openstack-ram_total`] && <div className="chart loading">
            <i className="fa fa-refresh fa-spin"></i>
          </div>}
        </div>

        <div className="col-md-6 chart-panel">
          <span>{t('boss.monitor.rabbitmq')}</span>
          <span className="pull-right text-muted">{t(`boss.monitor.intervals.${this.state.period}`)}</span>

          {this.props.context[`period-${this.state.period}-openstack-queues-items`] && <Chart
            className="chart"
            config={generateStepChartConfig(mergeTimeSeries(
              ['queues-items', this.props.context[`period-${this.state.period}-openstack-queues-items`].timeSeries]
            ), {
              'queues-items': { name: t('boss.monitor.rabbitmqQueuesItems') },
            })}
          />}
          {!this.props.context[`period-${this.state.period}-openstack-queues-items`] && <div className="chart loading">
            <i className="fa fa-refresh fa-spin"></i>
          </div>}
        </div>
      </div>
    );
  }
}

export default attach(C);
