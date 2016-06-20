import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import * as Actions from '../redux/actions';
import * as InstanceActions from '../redux/actions.instance';


class C extends TablePage {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `/${region.regionId}/instances`));

    this.initTable({
      status: ['pending', 'active', 'starting', 'stopped', 'stopping', 'restarting', 'scheduling', 'error'],
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return InstanceActions.requestDescribeInstances(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { dispatch, region, routerKey } = this.props;
    const instanceIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(InstanceActions.requestDeleteInstances(routerKey, region.regionId, instanceIds))
      .then(() => {
        resolve();
        this.onRefresh({}, false)();
      }).catch(() => {
        reject();
      });
    });
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.instanceSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.instanceSet.map((u) => { return u.instanceId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('status')}</th>
            <th>{t('vcpus')}</th>
            <th>{t('memory')}</th>
            <th>{t('address')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.instanceSet.map((instance) => {
          return (
            <tr key={instance.instanceId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(instance.instanceId)} checked={this.props.context.selected[instance.instanceId] === true} />
              </td>
              <td>
                <Link to={`/${this.props.region.regionId}/instances/${instance.instanceId}`}>
                  {instance.instanceId}
                </Link>
              </td>
              <td>
                {instance.name && <strong>{instance.name}</strong>}
                {!instance.name && <i className="text-muted">{t('noName')}</i>}
              </td>
              <td className={`i-status i-status-${instance.status}`}>
                <i className="icon"></i>
                {t(`instanceStatus.${instance.status}`)}
              </td>
              <td>{instance.currentVCPUs}</td>
              <td>{instance.currentMemory}</td>
              <td>{instance.address}</td>
              <td>{moment.utc(instance.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }

  renderHeader() {
    const { t } = this.props;
    return (
      <div className="top-area">
        <div className="nav-text">
          <span className="light">
            {t('instanceManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`/${this.props.region.regionId}/instances/create`}>
            <i className="fa fa-plus"></i>&nbsp;{t('create')}
          </Link>
        </div>
      </div>
    );
  }

  renderFilters() {
    const { t } = this.props;
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="filter-item inline labels-filter">
            <div className="dropdown">
              <button className="dropdown-menu-toggle" data-toggle="dropdown" type="button">
                <span className="dropdown-toggle-text">{t('status')}</span>
                <i className="fa fa-chevron-down"></i>
              </button>
              <div className="dropdown-menu dropdown-select dropdown-menu-selectable">
                <div className="dropdown-content">
                  <ul>
                  {[{
                    status: ['pending', 'active', 'starting', 'stopped', 'stopping', 'restarting', 'scheduling', 'error'],
                    name: t('allAvaliableStatus'),
                  }, {
                    status: ['pending'],
                    name: t('instanceStatus.pending'),
                  }, {
                    status: ['active'],
                    name: t('instanceStatus.active'),
                  }, {
                    status: ['starting'],
                    name: t('instanceStatus.starting'),
                  }, {
                    status: ['stopped'],
                    name: t('instanceStatus.stopped'),
                  }, {
                    status: ['stopping'],
                    name: t('instanceStatus.stopping'),
                  }, {
                    status: ['restarting'],
                    name: t('instanceStatus.restarting'),
                  }, {
                    status: ['scheduling'],
                    name: t('instanceStatus.scheduling'),
                  }, {
                    status: ['error'],
                    name: t('instanceStatus.error'),
                  }, {
                    status: ['deleted', 'ceased'],
                    name: t('instanceStatus.deleted'),
                  }].map((filter) => {
                    return (
                      <li key={filter.name}>
                        <a
                          className={this.props.context.status.toString() === filter.status.toString() ? 'is-active' : ''}
                          href
                          onClick={this.onRefresh({ status: filter.status })}
                        >
                          {filter.name}
                        </a>
                      </li>
                    );
                  })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="filter-item inline">
            <input type="search" ref="search" placeholder={t('filterByIdorName')} className="form-control" onKeyPress={this.onSearchKeyPress} />
          </div>
          <div className="pull-right">
            <div className="dropdown inline prepend-left-10">
              <button className="dropdown-toggle btn" data-toggle="dropdown" type="button">
                <span className="light"></span> {this.props.context.reverse ? t('lastCreated') : t('firstCreated')}
                <b className="caret"></b></button>
              <ul className="dropdown-menu dropdown-menu-align-right dropdown-select dropdown-menu-selectable">
                <li><a className={this.props.context.reverse ? 'is-active' : ''} href onClick={this.onRefresh({ reverse: true })}>{t('lastCreated')}</a></li>
                <li><a className={this.props.context.reverse ? '' : 'is-active'} href onClick={this.onRefresh({ reverse: false })}>{t('firstCreated')}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={Object.keys(this.props.context.selected).length > 0 ? '' : 'hidden'}>
          <div className="filter-item inline">
            <ButtonForm onSubmit={this.onDelete} text={t('delete')} type="btn-danger" />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
