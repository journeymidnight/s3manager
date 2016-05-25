import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import InstanceCreateForm from '../forms/InstanceCreateForm';
import * as InstanceActions from '../redux/actions.instance';

class C extends RegionPage {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { dispatch, region, routerKey } = this.props;
    dispatch(InstanceActions.requestDescribePrerequisites(routerKey, region.regionId));
  }

  onSubmit(values) {
    const { dispatch, region, routerKey } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const imageId = values.imageId;
      const instanceTypeId = values.instanceTypeId;
      const subnetId = values.subnetId;

      dispatch(InstanceActions.requestCreateInstance(routerKey, region.regionId, {
        name,
        imageId,
        instanceTypeId,
        subnetId,
      }))
      .then(() => {
        resolve();
      }).catch((error) => {
        reject({ _error: error.message });
      });
    });
  }

  render() {
    const { imageSet, instanceTypeSet, subnetSet } = this.props.context;
    if (!(imageSet && instanceTypeSet && subnetSet)) {
      return <div />;
    }
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('pageInstanceCreate.createInstance')}
            </h3>
            <InstanceCreateForm onSubmit={this.onSubmit} {...this.props.context} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
