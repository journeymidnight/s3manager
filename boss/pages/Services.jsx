import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import SearchBox from '../../shared/components/SearchBox';
import StatusFilter from '../../shared/components/StatusFilter';
import * as ServiceActions from '../redux/actions.service';
import * as Actions from '../redux/actions';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('serviceManage'), '/services'));

    this.initTable(routerKey, {
      status: ['active'],
    });
  }

  refreshAction(routerKey, filters) {
    return ServiceActions.requestDescribeServices(routerKey, filters);
  }

  onDelete() {
    const { dispatch, routerKey } = this.props;
    const serviceIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(ServiceActions.requestDeleteServices(routerKey, serviceIds))
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
    return this.props.context.total > 0 && this.props.context.serviceSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.serviceSet.map((u) => { return u.serviceId; }))} />
            </th>
            <th width="250">{t('name')}</th>
            <th>{t('region')}</th>
            <th>{t('formServiceForm.publicEndpoint')}</th>
            <th width="250">{t('created')}</th>
            <th width="250">{'配置'}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.serviceSet.map((service) => {
          return (
            <tr key={service.serviceId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(service.serviceId)} checked={this.props.context.selected[service.serviceId] === true} />
              </td>
              <td>{service.serviceId}</td>
              <td>{service.regionId}</td>
              <td>{service.endpoint}</td>
              <td>{moment.utc(service.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
              <td>
                <div className="btn-group">
                  <Link className="btn btn-sm btn-info" to={`/services/${service.serviceId}`}>基本配置</Link>
                </div>
              </td>
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
          <span>
            {t('serviceManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to="/services/create">
            <i className="fa fa-plus"></i>&nbsp;{t('create')}
          </Link>
        </div>
      </div>
    );
  }

  renderFilters() {
    const { t } = this.props;
    const statusOption = [{
      status: ['active'],
      name: t('serviceStatus.active'),
    }, {
      status: ['deleted'],
      name: t('serviceStatus.deleted'),
    }];
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
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
