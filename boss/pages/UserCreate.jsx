import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import UserForm from '../forms/UserForm';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('userManage'), '/users'));
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const username = values.username;
      const email = values.email;
      const password = values.password;

      dispatch(Actions.requestCreateUser({
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
                <span>{t('create') + t('user')}</span>
              </div>
            </div>

            <UserForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
