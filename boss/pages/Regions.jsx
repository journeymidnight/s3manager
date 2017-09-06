import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import SearchBox from '../../shared/components/SearchBox';
import StatusFilter from '../../shared/components/StatusFilter';
import * as RegionActions from '../redux/actions.region';
import * as Actions from '../redux/actions';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));

    this.initTable(routerKey, {
      status: ['active'],
    });
  }

  refreshAction(routerKey, filters) {
    return RegionActions.requestDescribeRegions(routerKey, filters);
  }

  onDelete() {
    const { dispatch, routerKey } = this.props;
    const regionIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(RegionActions.requestDeleteRegions(routerKey, regionIds))
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
    return this.props.context.total > 0 && this.props.context.regionSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.regionSet.map((u) => { return u.regionId; }))} />
            </th>
            <th width="30%">{t('id')}</th>
            <th width="30%">{t('name')}</th>
            <th width="40%">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.regionSet.map((region) => {
          return (
            <tr key={region.regionId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(region.regionId)} checked={this.props.context.selected[region.regionId] === true} />
              </td>
              <td><Link to={`/regions/${region.regionId}`}>{region.regionId}</Link></td>
              <td><strong>{region.regionName}</strong></td>
              <td>{moment.utc(region.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
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
            {t('regionManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to="/regions/create">
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
      name: t('regionStatus.active'),
    }, {
      status: ['deleted'],
      name: t('regionStatus.deleted'),
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
