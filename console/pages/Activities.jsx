import React from 'react';
import Time from 'react-time';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import StatusFilter from '../../shared/components/StatusFilter';
import TimeSorter from '../../shared/components/TimeSorter';
import * as Actions from '../redux/actions';
import * as ActivityActions from '../redux/actions.activity';

class C extends TablePage {

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('activityManage'), `/${region.regionId}/activities`));

    this.initTable();
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return ActivityActions.requestDescribeJobs(routerKey, region.regionId, filters);
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.jobSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.jobSet.map((u) => { return u.jobId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('action')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.jobSet.map((job) => {
            return (
              <tr key={job.jobId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(job.jobId)} checked={this.props.context.selected[job.jobId] === true} />
                </td>
                <td>{job.jobId}</td>
                <td>
                  {job.action && <strong>{job.action}</strong>}
                  {!job.action && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td className={`i-status i-status-${job.status}`}>
                  <i className="icon"></i>
                  {t(`jobStatus.${job.status}`)}
                </td>
                <td className="light"><Time value={job.created} format="YYYY-MM-DD HH:mm:ss" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderFilters() {
    const { t } = this.props;
    const statusOption = [
      {
        status: ['pending', 'running', 'finished', 'error'],
        name: t('allAvaliableStatus'),
      }, {
        status: ['pending'],
        name: t('jobStatus.pending'),
      }, {
        status: ['running'],
        name: t('jobStatus.running'),
      }, {
        status: ['finished'],
        name: t('jobStatus.finished'),
      }, {
        status: ['error'],
        name: t('jobStatus.error'),
      }];
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="filter-item inline labels-filter">
            <StatusFilter statusOption={statusOption} filterStatus={this.props.context.status} onRefresh={this.onRefresh} />
          </div>
          <div className="filter-item inline">
            <input type="search" ref="search" placeholder={t('filterByIdorName')} className="form-control" onKeyPress={this.onSearchKeyPress} />
          </div>
          <div className="pull-right">
            <TimeSorter isReverse={this.props.context.reverse} onRefresh={this.onRefresh} />
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

  renderHeader() {
    const { t } = this.props;
    return (
      <div className="top-area">
        <div className="nav-text">
          <span className="light">
            {t('activityManageDescription')}
          </span>
        </div>
      </div>
    );
  }
}

export default attach(C);
