import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import SearchBox from '../../shared/components/SearchBox';
import * as UserActions from '../redux/actions.user';
import * as Actions from '../redux/actions';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('userManage'), '/users'));

    this.initTable(routerKey);
  }

  refreshAction(routerKey, filters) {
    return Actions.requestDescribeUsers(filters);
  }

  onDelete() {
    const { dispatch, routerKey } = this.props;
    const userIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(UserActions.requestDeleteUsers(routerKey, userIds))
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
    return this.props.context.total > 0 && this.props.context.userSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.userSet.map((u) => { return u.userId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('username')}</th>
            <th>{t('email')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.userSet.map((user) => {
          return (
            <tr key={user.userId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(user.userId)} checked={this.props.context.selected[user.userId] === true} />
              </td>
              <td>
                <Link to={`/users/${user.userId}`}>
                  {user.userId}
                </Link>
              </td>
              <td><strong>{user.username}</strong></td>
              <td><strong>{user.email}</strong></td>
              <td>{moment.utc(user.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
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
            {t('userManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to="/users/create">
            <i className="fa fa-plus"></i>&nbsp;{t('create')}
          </Link>
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
