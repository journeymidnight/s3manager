import { call as rawCall } from '../../shared/services/api';

class BOSS {
  call(action, params) {
    const payload = Object.assign({}, params);
    return rawCall('post', `/api/${action}`, payload);
  }
  describeAdmins(filters = {}) {
    return this.call('DescribeAdmins', filters);
  }
  createAdmin(admin) {
    return this.call('CreateAdmin', admin);
  }
  modifyAdmin(admin) {
    return this.call('ModifyAdminAttributes', admin);
  }
  describeTickets(filter = {}) {
    return this.call('DescribeTickets', filter);
  }
  describeTicketReplies(ticketId, filter = {}) {
    return this.call('DescribeTicketReplies', {
      ticketId,
      ...filter,
    });
  }
  createTicketReply(ticketId, content) {
    return this.call('CreateTicketReply', {
      ticketId,
      content,
    });
  }
  closeTickets(ticketIds) {
    return this.call('CloseTickets', {
      ticketIds,
    });
  }
}

export default new BOSS();
