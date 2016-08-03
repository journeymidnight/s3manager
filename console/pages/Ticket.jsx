import React from 'react';
import Time from 'react-time';
import Page, { attach } from '../../shared/pages/Page';
import { confirmModal } from '../../shared/components/Modal';
import TicketReplyForm from '../forms/TicketReplyForm';
import * as Actions from '../redux/actions';
import * as TicketActions from '../redux/actions.ticket';


class C extends Page {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.onReply = this.onReply.bind(this);
    this.closeTicket = this.closeTicket.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('ticketManage'), `${servicePath}/tickets`));

    this.setInterval(() => {
      this.refresh();
    }, 2000);
  }

  refresh() {
    const { dispatch, routerKey, params } = this.props;

    const ticketId = params.ticketId;
    dispatch(TicketActions.requestDescribeTicket(routerKey, ticketId))
    .then(() => {
      this.ticket = this.props.context.ticket;
      dispatch(TicketActions.requestDescribeTicketReplies(routerKey, params.ticketId, {
        reverse: false,
      }));
    });
  }

  isEnabled(ticket) {
    return ticket.status !== 'closed';
  }

  closeTicket(e) {
    e.preventDefault();

    const { t, dispatch, routerKey, params } = this.props;

    confirmModal(t('confirmDelete'), () => {
      dispatch(TicketActions.requestCloseTickets(routerKey, [params.ticketId]));
    });
  }

  onReply(values) {
    const { dispatch, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      const content = values.content;

      dispatch(TicketActions.requestCreateTicketReply(routerKey, params.ticketId, content))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  renderReplies() {
    const { t } = this.props;

    if (this.props.context.replySet) {
      return (
        <div>
          {this.props.context.replySet.map((reply) => {
            return (
              <div key={reply.replyId}>
                <div className="col-md-2">
                  <p className="pull-right">
                    <strong>{reply.userId && reply.username}</strong>
                    <strong>{reply.adminId && reply.username}</strong>
                  </p>
                </div>
                <div className="col-md-10">
                  <div className="panel panel-default">
                    <div className="panel-body">
                      <p>{reply.content}</p>
                      <span>{t('pageTicket.replied')}: <Time value={reply.created} format="YYYY-MM-DD HH:mm:ss" /></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return <div />;
  }

  render() {
    const { t, params } = this.props;

    const ticket = this.props.context.ticket || this.ticket;

    if (!ticket || ticket.ticketId !== params.ticketId) {
      this.refresh();

      return <div />;
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">
            <div className="top-area">
              <div className="nav-text">
                <i className="light">
                  {t('ticket')} {ticket.ticketId}
                </i>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {<strong>{ticket.title}</strong>}
                    {this.isEnabled(ticket) && <div className="btn-group pull-right">
                      <button type="button" className="btn btn-info" onClick={this.closeTicket}>
                        {t('pageTicket.closeTicket')}
                      </button>
                    </div>}
                  </div>
                  <div className="panel-body">
                    <p>{ticket.content}</p>
                    <br />
                    <span>{t('pageTicket.created')}: <Time value={ticket.created} format="YYYY-MM-DD HH:mm:ss" /></span>
                  </div>
                </div>
              </div>
              {this.renderReplies()}
              {this.isEnabled(ticket) && <div>
                <div className="col-md-2"></div>
                <div className="col-md-10">
                  <hr />
                  <TicketReplyForm onSubmit={this.onReply} />
                </div>
              </div>}
              {!this.isEnabled(ticket) && <div className="panel-body">
                {t('pageTicket.closed')}
              </div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
