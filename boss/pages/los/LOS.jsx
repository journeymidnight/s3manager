import React from 'react';
import Page, { attach } from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';
import * as ServiceActions from '../../redux/actions.service';

class C extends Page {

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('serviceManage'), '/services'));
  }

  refresh() {
    const { params, dispatch } = this.props;
    this.serviceId = params.serviceId;
    dispatch(ServiceActions.requestDescribeService(this.serviceId))
    .then(() => {
      this.service = this.props.context.service;
    });
  }

  render() {
    const { t, params } = this.props;

    const service = this.props.context.service || this.service;
    if (!service || service.serviceId !== params.serviceId) {
      this.refresh();

      return <div />;
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                {t('service')}&nbsp;<i>{service.serviceId}</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
