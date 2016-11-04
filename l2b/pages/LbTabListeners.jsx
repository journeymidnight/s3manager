import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import Modal, { confirmModal } from '../../shared/components/Modal';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
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
    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    this.initTable(routerKey, {
      status: ['active', 'pending'],
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
      dispatch(LoadBalancerActions.requestCreateLbListener(routerKey, region.regionId, {
        loadBalancerId: loadBalancer.loadBalancerId,
        ...values,
      }))
        .then(() => {
          resolve();
          this.refs.listenerCreateModal.hide();
          this.onRefresh({}, false)();
        })
        .catch((error) => {
          dispatch(Actions.notifyAlert(error.displayMsg || error.message));
          reject();
        });
    });
  }

  showCreatePanel(e) {
    e.preventDefault();

    if (this.props.context.loadBalancer.status !== 'active') {
      this.props.dispatch(LoadBalancerActions.disable());
    } else {
      this.refs.listenerCreateModal.show();
    }
  }

  onDelete() {
    const { t, dispatch, routerKey, region, context } = this.props;
    const listenerIds = Object.keys(context.selected);

    if (context.loadBalancer.status !== 'active') {
      dispatch(LoadBalancerActions.disable());
    } else {
      confirmModal(t('confirmDelete'), () => {
        return new Promise((resolve, reject) => {
          dispatch(LoadBalancerActions.requestDeleteLbListeners(routerKey, region.regionId, listenerIds))
            .then(() => {
              resolve();
              this.onRefresh({}, false)();
            })
            .catch(() => {
              reject();
            });
        });
      });
    }
  }

  renderHeader() {
    const { t } = this.props;
    return (
      <div>
        <div className="top-area">
          <div className="nav-text">
            <span className="light">
              {t('pageLoadBalancer.listenerList')}
            </span>
          </div>
          <div className="nav-controls">
            <a className="btn btn-new" href onClick={this.showCreatePanel}>
              <i className="fa fa-plus"></i>&nbsp;{t('create')}
            </a>
          </div>
        </div>
        <Modal title={t('pageLoadBalancer.createListener')} ref="listenerCreateModal" >
          <ListenerCreateForm onSubmit={this.onCreateListener} />
        </Modal>
      </div>
    );
  }

  renderTable() {
    const { t, servicePath, loadBalancer } = this.props;
    return this.props.context.total > 0 && this.props.context.listenerSet.length > 0 && (
      <table className="table table-list">
        <thead>
          <tr>
            <th width="40">
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(this.props.context.listenerSet.map((u) => { return u.loadBalancerListenerId; }))}
                checked={this.isAllSelected(this.props.context.listenerSet.map((u) => { return u.loadBalancerListenerId; }))}
              />
            </th>
            <th width="150">{t('id')}</th>
            <th>{`${t('protocol')}/${t('port')}`}</th>
            <th>{t('status')}</th>
            <th>{t('pageLoadBalancer.forward')}</th>
            <th>{t('pageLoadBalancer.session')}</th>
            <th>{t('pageLoadBalancer.health')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.listenerSet.map((listener) => {
          return (
            <tr key={listener.loadBalancerListenerId}>
              <td>
                <input
                  type="checkbox"
                  className="selected"
                  onChange={this.onSelect(listener.loadBalancerListenerId)}
                  checked={this.props.context.selected[listener.loadBalancerListenerId] === true}
                />
              </td>
              <td>
                <Link to={`${servicePath}/load_balancers/${loadBalancer.loadBalancerId}/${listener.loadBalancerListenerId}`}>
                  {listener.loadBalancerListenerId}
                </Link>
              </td>
              <td>
                {`${listener.protocol}/${listener.port}`}
              </td>
              <td className={`i-status i-status-${listener.status}`}>
                <span>
                  <i className="icon"></i>
                  {t(`lblistenerStatus.${listener.status}`)}
                </span>
              </td>
              <td>
                {t('pageLoadBalancer.roundRobin')}
              </td>
              <td>
                {listener.sessionPersistenceMode ? t('pageLoadBalancer.on') : t('pageLoadBalancer.off')}
              </td>
              <td>
                {listener.healthMonitorType ? t('pageLoadBalancer.on') : t('pageLoadBalancer.off')}
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }

  renderFilters() {
    const { t } = this.props;
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.doSearch}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="filter-item inline">
            <SearchBox ref="searchBox" placeholder={t('filterByIdorName')} onEnterPress={this.onSearchKeyPress} onButtonClick={this.onSearchButtonClick} />
          </div>
          <div className="pull-right">
            <TimeSorter isReverse={this.props.context.reverse} onRefresh={this.onRefresh} />
          </div>
        </div>
        <div className={Object.keys(this.props.context.selected).length > 0 ? '' : 'hidden'}>
          <div className="filter-item inline">
            <ButtonForm
              onSubmit={this.onDelete}
              text={t('delete')}
              type="btn-danger"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
