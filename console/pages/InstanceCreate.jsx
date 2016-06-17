import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import InstanceCreateForm from '../forms/InstanceCreateForm';
import * as Actions from '../redux/actions';
import * as InstanceActions from '../redux/actions.instance';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region, routerKey } = this.props;

    dispatch(Actions.setHeader(t('instanceManage'), `/${region.regionId}/instances`));
    dispatch(InstanceActions.requestDescribePrerequisites(routerKey, region.regionId)).
    then(() => {
      dispatch(Actions.extendContext({ initialized: true }, routerKey));
    });
  }

  onSubmit(values) {
    const { dispatch, region, routerKey } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const imageId = values.imageId;
      const instanceTypeId = values.instanceTypeId;
      const subnetId = values.subnetId;
      const count = parseInt(values.count, 10) || 1;

      dispatch(InstanceActions.requestCreateInstances(routerKey, region.regionId, {
        name,
        imageId,
        instanceTypeId,
        subnetId,
        count,
        loginMode: 'password',
        loginPassword: 'P4ssw0rd!@#!#!@#!@#',
      }))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  renderAfterInitialized() {
    const { t } = this.props;
    const { subnetSet, instanceTypeSet, imageSet } = this.props.context;

    let hint = undefined;
    if (imageSet.length === 0) {
      hint = t('pageInstanceCreate.imageNotFound');
    }
    if (instanceTypeSet.length === 0) {
      hint = t('pageInstanceCreate.instanceNotFound');
    }
    if (subnetSet.length === 0) {
      hint = t('pageInstanceCreate.subnetNotFound');
    }

    if (hint) {
      return (
        <div>
          {hint}
        </div>
      );
    }

    const initialValues = {
      imageId: imageSet[0].imageId,
      subnetId: subnetSet[0].subnetId,
      instanceTypeId: instanceTypeSet[0].instanceTypeId,
      count: 1,
    };
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span className="light">
                  {t('pageInstanceCreate.createInstance')}
                </span>
              </div>
            </div>
            <InstanceCreateForm
              onSubmit={this.onSubmit}
              subnetSet={subnetSet}
              instanceTypeSet={instanceTypeSet}
              imageSet={imageSet}
              initialValues={initialValues}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
