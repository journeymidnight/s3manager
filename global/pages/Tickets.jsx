import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Time from 'react-time';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import StatusFilter from '../../shared/components/StatusFilter';
import TimeSorter from '../../shared/components/TimeSorter';
import * as Actions from '../../console-common/redux/actions';
import * as TicketActions from '../redux/actions.ticket';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('ticketManage'), '/tickets'));

    this.initTable(routerKey, {
      status: ['pending', 'in-progress', 'closed'],
    });
  }

  refreshAction(routerKey, filters) {
    return TicketActions.requestDescribeTickets(routerKey, filters);
  }

  onDelete() {
    const { dispatch } = this.props;
    const ticketIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(TicketActions.requestDeleteTickets(ticketIds))
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
    return this.props.context.total > 0 && this.props.context.ticketSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.ticketSet.map((u) => { return u.ticketId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('title')}</th>
            <th width="150">{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.ticketSet.map((ticket) => {
            return (
              <tr key={ticket.ticketId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(ticket.ticketId)} checked={this.props.context.selected[ticket.ticketId] === true} />
                </td>
                <td>
                  <Link to={`/tickets/${ticket.ticketId}`}>
                    {ticket.ticketId}
                  </Link>
                </td>
                <td><strong>{ticket.title}</strong></td>
                <td className={`i-status i-status-${ticket.status}`}>
                  <i className="icon"></i>
                  {t(`ticketStatus.${ticket.status}`)}
                </td>
                <td className="light"><Time value={ticket.created} format="YYYY-MM-DD HH:mm:ss" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderHeader() {
    const { t, servicePath } = this.props;
    return (
      <div className="top-area">
        <div className="nav-text">
          <span className="light">
            {t('ticketManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`${servicePath}/tickets/create`}>
            <i className="fa fa-plus"></i>&nbsp; {t('create')}
          </Link>
        </div>
      </div>
    );
  }

  renderFilters() {
    const { t } = this.props;
    const statusOption = [
      {
        status: ['pending', 'in-progress', 'closed'],
        name: t('allStatus'),
      }, {
        status: ['pending'],
        name: t('ticketStatus.pending'),
      }, {
        status: ['in-progress'],
        name: t('ticketStatus.in-progress'),
      }, {
        status: ['closed'],
        name: t('ticketStatus.closed'),
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
            <input type="search" ref="search" placeholder={t('filterByIdorTitle')} className="form-control" onKeyPress={this.onSearchKeyPress} />
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
}

export default attach(C);
