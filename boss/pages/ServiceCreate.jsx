import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as ServiceActions from '../redux/actions.service';
import * as Actions from '../redux/actions';
import ServiceForm from '../forms/ServiceForm';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('serviceManage'), '/services'));
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const regionId = values.regionId;
      const serviceKey = values.serviceKey;
      const publicEndpoint = values.publicEndpoint;
      const manageEndpoint = values.manageEndpoint;
      const manageKey = values.manageKey;
      const manageSecret = values.manageSecret;

      dispatch(ServiceActions.requestCreateService({
        regionId,
        serviceKey,
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
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">

            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{t('create') + t('service')}</span>
              </div>
            </div>

            <ServiceForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
