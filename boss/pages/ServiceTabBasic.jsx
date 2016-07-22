import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import ServiceForm from '../forms/ServiceForm';
import * as ServiceActions from '../redux/actions.service';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('serviceManage'), '/services'));
  }

  onSave(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const publicEndpoint = values.publicEndpoint;
      const manageEndpoint = values.manageEndpoint;
      const manageKey = values.manageKey;
      const manageSecret = values.manageSecret;

      dispatch(ServiceActions.requestModifyService({
        serviceId: this.props.service2.serviceId,
        name,
        publicEndpoint,
        manageEndpoint,
        manageKey,
        manageSecret,
      }))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  render() {
    const { t, service2 } = this.props;
    return (
      <div className="panel panel-default prepend-top-20">
        <div className="panel-heading">{t('settings')}</div>
        <div className="panel-body">
          <ServiceForm initialValues={service2} onSubmit={this.onSave} isUpdate />
        </div>
      </div>
    );
  }
}

export default attach(C);
