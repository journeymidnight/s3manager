import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { attach } from '../../shared/pages/Page';
import Modal, { confirmModal } from '../../shared/components/Modal';
import { buttonForm } from '../../shared/forms/ButtonForm';
import TablePage from '../../shared/pages/TablePage';
import TimeSorter from '../../shared/components/TimeSorter';
import SearchBox from '../../shared/components/SearchBox';
import ListenerCreateForm from '../forms/ListenerCreateForm';
import * as Actions from '../../console-common/redux/actions';
import * as LoadBalancerActions from '../redux/actions.load_balancer';


class C extends TablePage {

  constructor(props) {
    super(props);

    this.onCreateListener = this.onCreateListener.bind(this);
    this.showCreatePanel = this.showCreatePanel.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), `${servicePath}/networks`));

    this.initTable(routerKey, {
      status: ['active'],
      isTabPage: true,
    });
  }

  refreshAction(routerKey, filters) {
    const { region, loadBalancer } = this.props;
    filters.loadBalancerIds = [loadBalancer.loadBalancerId];
    return LoadBalancerActions.requestDescribeLbListeners(routerKey, region.regionId, filters);
  }

  onCreateListener(values) {
    const { dispatch, region, routerKey, loadBalancer } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const port = Number(values.port);

      dispatch(LoadBalancerActions.requestCreateLbListener(routerKey, region.regionId, {
        loadBalancerId: loadBalancer.loadBalancerId,
        protocol: 'tcp', 
        name,
        port,
      }))
        .then(() => {
          resolve();
          this.refs.listenerCreateModal.hide();
          this.onRefresh({}, false)();
        }).catch((error) => {
          dispatch(Actions.notifyAlert(error.displayMsg || error.message));
          reject();
        });
    });
  }

  showCreatePanel(e) {
    e.preventDefault();
    this.refs.listenerCreateModal.show();
  }

  renderHeader() {
    const { t } = this.props;
    return (
      <div>
        <div className="top-area">
          <div className="nav-text">
            <span className="light">
              {t('pageLoadBalancer.listener')}
            </span>
          </div>
          <div className="nav-controls">
            <a className="btn btn-new" href onClick={this.showCreatePanel}>
              <i className="fa fa-plus"></i>&nbsp;{t('create')}
            </a>
          </div>
        </div>
        <Modal title={t('pageNetwork.createSubnet')} ref="listenerCreateModal" >
          <ListenerCreateForm onSubmit={this.onCreateListener} />
        </Modal>
      </div>
    );
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.loadBalancerListenerSet.length > 0 && (
      <table className="table table-list">
        <thead>
          <tr>
            <th width="40">
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(this.props.context.loadBalancerListenerSet.map((u) => { return u.loadBalancerListenerId; }))}
                checked={this.isAllSelected(this.props.context.loadBalancerListenerSet.map((u) => { return u.loadBalancerListenerId; }))}
              />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('port')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.loadBalancerListenerSet.map((listener) => {
          return (
            <tr key={listener.loadBalancerListenerId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(listener.loadBalancerListenerId)} checked={this.props.context.selected[listener.loadBalancerListenerId] === true} />
              </td>
              <td>{listener.loadBalancerListenerId}</td>
              <td>
                {listener.port}
              </td>
              <td>{moment.utc(listener.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }

}

export default attach(C);
