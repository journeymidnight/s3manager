import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import * as ServiceActions from '../redux/actions.service';
import * as Actions from '../redux/actions';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('serviceManage'), '/services'));

    this.initTable();
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
            <th width="150">{t('name')}</th>
            <th>{t('formServiceForm.publicEndpoint')}</th>
            <th>{t('formServiceForm.manageEndpoint')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.serviceSet.map((service) => {
          return (
            <tr key={service.serviceId}>
              <td><Link to={`/services/${service.serviceId}`}>{service.serviceKey} ( {service.regionId} )</Link></td>
              <td>{service.publicEndpoint}</td>
              <td>{service.manageEndpoint}</td>
              <td>{moment.utc(service.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
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
    return <div />;
  }
}

export default attach(C);
