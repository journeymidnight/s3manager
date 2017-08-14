import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import AccessKeyForm from '../forms/AccessKeyForm';
import { Bar } from '../../lecloud-design';
import * as Actions from '../redux/actions';
import * as AccessKeyActions from '../redux/actions.access_key';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCloseAccessKeyCreate = this.onCloseAccessKeyCreate.bind(this);
  }

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('accessKeyManage'), '/access_keys'));
  }

  onCloseAccessKeyCreate() {
    const { dispatch, servicePath } = this.props;
    dispatch(push(`${servicePath}/access_keys`));
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
        dispatch(push('/access_keys'));
      }).catch((error) => {
        dispatch(Actions.notifyAlert(error.displayMsg || error.message));
        reject();
      });
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div className="content">
        <Bar>
          <h2 className="bar-title">{t('pageAccessKeyCreate.createAccessKey')}</h2>
        </Bar>
        <div className="content-body">
          <AccessKeyForm
            onSubmit={this.onSubmit}
            closeForm={this.onCloseAccessKeyCreate}
          />
        </div>
      </div>
    );
  }
}

export default attach(C);
