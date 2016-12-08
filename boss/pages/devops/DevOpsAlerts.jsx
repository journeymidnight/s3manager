import moment from 'moment';
import React from 'react';
import { attach } from '../../../shared/pages/Page';
import TablePage from '../../../shared/pages/TablePage';
import ButtonForm from '../../../shared/forms/ButtonForm';
import SearchBox from '../../../shared/components/SearchBox';
import * as Actions from '../../redux/actions';
import * as DevOpsActions from '../../redux/actions.devops';

class C extends TablePage {

  initialize(routerKey) {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('alertManage'), '/alerts'));

    this.initTable(routerKey);
  }

  refreshAction(routerKey) {
    const { region2 } = this.props;
    return DevOpsActions.requestDescribeAlerts(routerKey, region2);
  }

  onDelete() {
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.alertSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.alertSet.map((u) => { return u.alertId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('endpoint')}</th>
            <th>{t('metric')}</th>
            <th>{t('status')}</th>
            <th>{t('step')}</th>
            <th>{t('stra_id')}</th>
            <th>{t('tags')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.alertSet.map((alert) => {
          return (
            <tr key={alert.alarmId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(alert.alertId)} checked={this.props.context.selected[alert.alertId] === true} />
              </td>
              <td>{alert.alarmId}</td>
              <td><strong>{alert.endpoint}</strong></td>
              <td><strong>{alert.metric}</strong></td>
              <td><strong>{alert.status}</strong></td>
              <td><strong>{alert.step}</strong></td>
              <td><strong>{alert.stra_id}</strong></td>
              <td><strong>{alert.tags}</strong></td>
              <td>{moment.utc(alert.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
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
            {t('alertManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
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
          <div className="filter-item inline">
            <SearchBox ref="searchBox" placeholder={t('filterByIdorName')} onEnterPress={this.onSearchKeyPress} onButtonClick={this.onSearchButtonClick} />
          </div>
          <div className="pull-right">
            <div className="dropdown inline prepend-left-10">
              <button className="dropdown-toggle btn" data-toggle="dropdown" type="button">
                {this.props.context.reverse ? t('lastCreated') : t('firstCreated')}
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
