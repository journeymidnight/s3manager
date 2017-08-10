import React from 'react';
import Time from 'react-time';
import Page, { attach } from '../../shared/pages/Page';
import * as UserActions from '../redux/actions.user';
import * as Actions from '../redux/actions';

class C extends Page {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.activeUser = this.activeUser.bind(this);
    this.deactiveUser = this.deactiveUser.bind(this);
  }

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('userManage'), '/users'));

    this.setInterval(() => {
      this.refresh();
    }, 2000);
  }

  refresh() {
    const { dispatch, params } = this.props;

    const userId = params.userId;
    dispatch(Actions.requestDescribeUser(userId))
    .then(() => {
      this.user = this.props.context.user;
    });
  }

  isEnabled(user) {
    return user.status !== 'delete';
  }

  activeUser(e) {
    e.preventDefault();

    const { dispatch, routerKey, params } = this.props;
    const userId = params.userId;

    dispatch(UserActions.requestActiveUsers(routerKey, [userId]));
  }

  deactiveUser(e) {
    e.preventDefault();

    const { dispatch, routerKey, params } = this.props;
    const userId = params.userId;

    dispatch(UserActions.requestDeactiveUsers(routerKey, [userId]));
  }

  render() {
    const { t, params } = this.props;

    const user = this.props.context.user || this.user;
    if (!user || user.userId !== params.userId) {
      this.refresh();

      return <div />;
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">
            <div className="top-area">
              <div className="nav-text">
                <span>{t('user')}&nbsp;<i>{user.userId}</i></span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageUser.basic')}
                    {this.isEnabled(user) && <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={['active'].indexOf(user.status) === 0}
                            onClick={this.activeUser}
                          >
                            {t('pageUser.activeUser')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={['inactive'].indexOf(user.status) === 0}
                            onClick={this.deactiveUser}
                          >
                            {t('pageUser.deactiveUser')}
                          </button>
                        </li>
                      </ul>
                    </div>}
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td><span>{user.userId}</span></td>
                      </tr>
                      <tr>
                        <td>{t('username')}</td>
                        <td>
                          <span>
                          {user.username && <strong>{user.username}</strong>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('email')}</td>
                        <td>
                          <span>
                          {user.email && <span>{user.email}</span>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${user.status}`}>
                          <span>
                            <i className="icon"></i>
                            {t(`userStatus.${user.status}`)}
                            <br />
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td><span><Time value={user.created} format="YYYY-MM-DD HH:mm:ss" /></span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
