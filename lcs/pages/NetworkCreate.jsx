import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import NetworkCreateForm from '../forms/NetworkCreateForm';
import * as Actions from '../../console-common/redux/actions';
import * as NetworkActions from '../redux/actions.network';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), `${servicePath}/networks`));
  }

  onSubmit(values) {
    const { dispatch, region, routerKey, servicePath } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const cidr = values.cidr;

      dispatch(NetworkActions.requestCreateNetwork(routerKey, region.regionId, {
        name,
        cidr,
      }))
        .then(() => {
          dispatch(push(`${servicePath}/networks`));
          resolve();
        }).catch((error) => {
          dispatch(Actions.notifyAlert(error.displayMsg || error.message));
          reject();
        });
    });
  }

  render() {
    const { t } = this.props;
    const initialValues = {
      cidr: '192.168.0.0/24',
    };
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">

            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{t('pageNetworkCreate.createNetwork')}</span>
              </div>
            </div>
            <NetworkCreateForm onSubmit={this.onSubmit} initialValues={initialValues} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
