import React from 'react';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import InstanceCreateForm from '../forms/InstanceCreateForm';
import * as Actions from '../../console-common/redux/actions';
import * as InstanceActions from '../redux/actions.instance';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, region, servicePath } = this.props;

    dispatch(Actions.setHeader(t('instanceManage'), `${servicePath}/instances`));
    dispatch(InstanceActions.requestDescribePrerequisites(routerKey, region.regionId)).
    then(() => {
      dispatch(Actions.extendContext({ initialized: true }, routerKey));
    });
  }

  onSubmit(values) {
    const { dispatch, region, routerKey, servicePath } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.hostname;
      const imageId = values.imageId;
      const instanceTypeId = values.instanceTypeId;
      const subnetId = values.subnetId;
      const keyPairId = values.keyPairId;
      const loginMode = values.loginMode;
      const loginPassword = values.loginPassword;
      const count = parseInt(values.count, 10) || 1;

      dispatch(InstanceActions.requestCreateInstances(routerKey, region.regionId, {
        name,
        imageId,
        instanceTypeId,
        subnetId,
        count,
        loginMode,
        loginPassword,
        keyPairId,
      }))
        .then(() => {
          resolve();
          dispatch(push(`${servicePath}/instances`));
        }).catch((error) => {
          dispatch(Actions.notifyAlert(error.displayMsg || error.message));
          reject({ _error: error.message });
        });
    });
  }

  renderAfterInitialized() {
    const { t, servicePath, service } = this.props;
    const { networkSet, instanceTypeSet, publicImageSet, privateImageSet, keyPairSet } = this.props.context;

    let hint = undefined;
    if (publicImageSet.length + privateImageSet.length === 0 || instanceTypeSet.length === 0) {
      hint = t('pageInstanceCreate.imageOrInstanceTypeNotFound');
    } else if (networkSet.length === 0) {
      hint = (
        <div>
          <p>{t('pageInstanceCreate.networkNotFound')}</p>
          <Link className="btn btn-new" to={`${servicePath}/networks/create`}>{t('pageNetworkCreate.createNetwork')}</Link>
        </div>
      );
    }

    if (hint) {
      return (
        <div className="container-fluid container-limited">
          <div className="content">
            <div className="clearfix">
              <div className="alert alert-help prepend-top-default">
                {hint}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{t('pageInstanceCreate.createInstance')}</span>
              </div>
            </div>
            <InstanceCreateForm
              onSubmit={this.onSubmit}
              networkSet={networkSet}
              instanceTypeSet={instanceTypeSet}
              publicImageSet={publicImageSet}
              privateImageSet={privateImageSet}
              keyPairSet={keyPairSet}
              service={service}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
