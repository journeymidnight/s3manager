import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import Modal, { confirmModal } from '../../shared/components/Modal';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import TimeSorter from '../../shared/components/TimeSorter';
import SearchBox from '../../shared/components/SearchBox';
import BackendCreateForm from '../forms/BackendCreateForm';
import UpdateForm from '../forms/UpdateForm';
import WeightForm from '../forms/WeightForm';
import * as Actions from '../../console-common/redux/actions';
import * as LoadBalancerActions from '../redux/actions.load_balancer';

class LbBackends extends TablePage {

  constructor(props) {
    super(props);

    this.onCreateBackend = this.onCreateBackend.bind(this);
    this.showCreatePanel = this.showCreatePanel.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdateBackend = this.onUpdateBackend.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onChangeWeight = this.onChangeWeight.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  initialize(routerKey) {
    this.initTable(routerKey, {
      status: ['active'],
      isTabPage: true,
    });
  }

  refreshAction(routerKey, filters) {
    const { region, params } = this.props;
    filters.loadBalanceListenerIds = [params.listenerId];
    return LoadBalancerActions.requestDescribeLbBackends(routerKey, region.regionId, filters);
  }

  onCreateBackend(values) {
    const { dispatch, region, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      dispatch(LoadBalancerActions.requestCreateLbBackend(routerKey, region.regionId, {
        loadBalancerListenerId: params.listenerId,
        name: values.name,
        description: values.description,
        address: values.address,
        port: Number(values.port),
        weight: Number(values.weight) || undefined,
      }))
        .then(() => {
          resolve();
          this.refs.backendCreateModal.hide();
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
      this.refs.backendCreateModal.show();
    }
  }

  onUpdateBackend(backendId) {
    const { routerKey, dispatch } = this.props;

    dispatch(Actions.extendContext({
      backendId,
    }, routerKey));

    setTimeout(() => this.refs.updateModal.show(), 100);
  }

  onChangeWeight(backendId) {
    const { routerKey, dispatch } = this.props;
    dispatch(Actions.extendContext({
      backendId,
    }, routerKey));

    setTimeout(() => this.refs.weightModal.show(), 100);
  }

  onUpdate(values) {
    const { dispatch, region, routerKey, context } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(LoadBalancerActions.requestModifyLoadBalancerBackend(routerKey, region.regionId, context.backendId, name, description))
        .then(() => {
          resolve();
          this.refs.updateModal.hide();
          this.refresh();
        })
        .catch(() => {
          reject();
        });
    });
  }

  onChange(values) {
    const { dispatch, region, routerKey, context } = this.props;

    return new Promise((resolve, reject) => {
      dispatch(LoadBalancerActions.requestUpdateLoadBalancerBackend(routerKey, region.regionId, context.backendId, values))
        .then(() => {
          resolve();
          this.refs.weightModal.hide();
          this.refresh();
        })
        .catch(() => {
          reject();
        });
    });
  }

  onDelete() {
    const { t, dispatch, routerKey, region, context } = this.props;
    const backendIds = Object.keys(context.selected);

    if (context.loadBalancer.status !== 'active') {
      dispatch(LoadBalancerActions.disable());
    } else {
      confirmModal(t('confirmDelete'), () => {
        return new Promise((resolve, reject) => {
          dispatch(LoadBalancerActions.requestDeleteLbBackends(routerKey, region.regionId, backendIds))
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
    const { t, context } = this.props;
    return (
      <div>
        <div className="top-area">
          <div className="nav-text">
            <span className="light">
              {t('pageLoadBalancer.backendList')}
            </span>
          </div>
          <div className="nav-controls">
            <a className="btn btn-new" href onClick={this.showCreatePanel}>
              <i className="fa fa-plus"></i>&nbsp;{t('create')}
            </a>
          </div>
        </div>
        <Modal title={t('pageLoadBalancer.createBackend')} ref="backendCreateModal" >
          <BackendCreateForm onSubmit={this.onCreateBackend} />
        </Modal>

        <Modal title={t('pageLoadBalancer.update')} ref="updateModal" >
          <UpdateForm onSubmit={this.onUpdate} initialValues={context.backendSet.filter(backend => backend.loadBalancerBackendId === context.backendId)[0]} />
        </Modal>

        <Modal title={t('weight')} ref="weightModal" >
          <WeightForm onSubmit={this.onChange} initialValues={context.backendSet.filter(backend => backend.loadBalancerBackendId === context.backendId)[0]} />
        </Modal>
      </div>
    );
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.backendSet.length > 0 && (
      <table className="table table-list">
        <thead>
          <tr>
            <th width="40">
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(this.props.context.backendSet.map((u) => { return u.loadBalancerBackendId; }))}
                checked={this.isAllSelected(this.props.context.backendSet.map((u) => { return u.loadBalancerBackendId; }))}
              />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('address')}</th>
            <th>{t('port')}</th>
            <th>{t('weight')}</th>
            <th>{t('action')}</th>
            {/* <th width="60">{t('status')}</th>
            <th width="200">{t('created')}</th> */}
          </tr>
        </thead>
        <tbody>
          {this.props.context.backendSet.map((backend) => {
            return (
              <tr key={backend.loadBalancerBackendId}>
                <td>
                  <input
                    type="checkbox"
                    className="selected"
                    onChange={this.onSelect(backend.loadBalancerBackendId)}
                    checked={this.props.context.selected[backend.loadBalancerBackendId] === true}
                  />
                </td>
                <td>
                  {backend.loadBalancerBackendId}
                </td>
                <td>
                  <span className="list-item-name">
                    {backend.name && <strong>{backend.name}</strong>}
                    {!backend.name && <i className="text-muted">{t('noName')}</i>}
                  </span>
                </td>
                <td>
                  {backend.address}
                </td>
                <td>
                  {backend.port}
                </td>
                <td>
                  {backend.weight}
                </td>
                <td>
                  <a
                    href
                    onClick={e => {
                      e.preventDefault();
                      this.onUpdateBackend(backend.loadBalancerBackendId);
                    }}
                  >
                    {t('pageLoadBalancer.update')}
                  </a>
                  /
                  <a
                    href
                    onClick={e => {
                      e.preventDefault();
                      this.onChangeWeight(backend.loadBalancerBackendId);
                    }}
                  >
                    {t('property')}
                  </a>
                </td>
                {/* <td className={`i-status i-status-${backend.status}`}>
                  <span>
                    <i className="icon"></i>
                    {t(`lblistenerStatus.${backend.status}`)}
                  </span>
                </td>
                <td>{moment.utc(backend.created).local().format('YYYY-MM-DD HH:mm:ss')}</td> */}
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

export default attach(LbBackends);
