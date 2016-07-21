import React from 'react';
import Page, { attach } from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';
import ServiceForm from '../../forms/ServiceForm';
import * as ServiceActions from '../../redux/actions.service';

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
      const description = values.description;

      dispatch(ServiceActions.requestModifyService({
        serviceId: this.props.service.serviceId,
        name,
        description,
      }))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  render() {
    const { t, service } = this.props;
    return (
      <div className="panel panel-default prepend-top-20">
        <div className="panel-heading">{t('settings')}</div>
        <div className="panel-body">
          <ServiceForm initialValues={service} onSubmit={this.onSave} />
        </div>
      </div>
    );
  }
}

export default attach(C);
