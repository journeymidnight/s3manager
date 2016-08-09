import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as AdminActions from '../redux/actions.admin';
import * as Actions from '../redux/actions';
import AdminForm from '../forms/AdminForm';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('adminManage'), '/admins'));
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const username = values.username;
      const email = values.email;
      const password = values.password;

      dispatch(AdminActions.requestCreateAdmin({
        username,
        email,
        password,
      }))
      .then(() => {
        resolve();
      }).catch((error) => {
        reject({ _error: error.message });
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
                <span>{t('create') + t('admin')}</span>
              </div>
            </div>

            <AdminForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
