import { call } from '../../shared/services/api';

class Auth {
  authorize(email, password, projectId) {
    return call('post', '/api/iam/authorize', {
      email,
      password,
      projectId,
    });
  }
  oAuthAccess(sessionId) {
    return call('post', '/api/iam/OAuthAccess', {
      sessionId,
    });
  }
  describeToken(token) {
    return call('post', '/api/iam/DescribeToken', {}, (options) => {
      options.headers['X-Le-Token'] = token;
    });
  }
  connectService(serviceKey, regionId) {
    return call('post', '/api/iam/ConnectService', {
      serviceKey,
      regionId,
    });
  }
  createAccessKey(name, description) {
    return call('post', '/api/iam/CreateAccessKey', {
      name,
      description,
    });
  }
  describeAccessKeys(filter = {}) {
    return call('post', '/api/iam/DescribeAccessKeys', filter);
  }
  deleteAccessKeys(accessKeys) {
    return call('post', '/api/iam/DeleteAccessKeys', {
      accessKeys,
    });
  }
  describeTickets(filter = {}) {
    return call('post', '/api/boss/DescribeTickets', filter);
  }
  describeTicketReplies(ticketId, filter = {}) {
    return call('post', '/api/boss/DescribeTicketReplies', {
      ticketId,
      ...filter,
    });
  }
  createTicket(title, content) {
    return call('post', '/api/boss/CreateTicket', {
      title,
      content,
    });
  }
  createTicketReply(ticketId, content) {
    return call('post', '/api/boss/CreateTicketReply', {
      ticketId,
      content,
    });
  }
  closeTickets(ticketIds) {
    return call('post', '/api/boss/CloseTickets', {
      ticketIds,
    });
  }
}

export default new Auth();
