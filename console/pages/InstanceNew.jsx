import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as InstanceTypeActions from '../redux/actions.instance_type';

class C extends RegionPage {

  componentDidMount() {
    const { dispatch, region, routerKey } = this.props;
    dispatch(InstanceTypeActions.requestDescribeInstanceTypes(routerKey, region.regionId));
  }

  render() {
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
