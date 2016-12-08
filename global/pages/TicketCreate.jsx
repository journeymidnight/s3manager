import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import TicketForm from '../forms/TicketForm';
import * as Actions from '../../console-common/redux/actions';
import * as TicketActions from '../redux/actions.ticket';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('ticketManage'), '/tickets'));
  }

  onSubmit(values) {
    const { dispatch } = this.props;

    return new Promise((resolve, reject) => {
      const title = values.title;
      const content = values.content;

      dispatch(TicketActions.requestCreateTicket(
        title,
        content
      ))
      .then(() => {
        resolve();
        dispatch(push('/tickets'));
      }).catch((error) => {
        dispatch(Actions.notifyAlert(error.displayMsg || error.message));
        reject();
      });
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">

            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{t('pageTicketCreate.createTicket')}</span>
              </div>
            </div>
            <TicketForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
