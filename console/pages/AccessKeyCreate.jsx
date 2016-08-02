import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import AccessKeyForm from '../forms/AccessKeyForm';
import * as Actions from '../redux/actions';
import * as AccessKeyActions from '../redux/actions.access_key';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('accessKeyManage'), '/access_keys'));
  }

  onSubmit(values) {
    const { dispatch } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(AccessKeyActions.requestCreateAccessKey(
        name,
        description
      ))
      .then(() => {
        resolve();
        dispatch(push('/g/access_keys'));
      }).catch((error) => {
        dispatch(Actions.notifyAlert(error.message));
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
                <span>{t('pageAccessKeyCreate.createAccessKey')}</span>
              </div>
            </div>
            <AccessKeyForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
