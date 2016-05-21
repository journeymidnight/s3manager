import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import InstanceNewForm from '../forms/InstanceNewForm';
import * as InstanceActions from '../redux/actions.instance';

class C extends RegionPage {

  componentDidMount() {
    const { dispatch, region, routerKey } = this.props;
    dispatch(InstanceActions.requestDescribePrerequisites(routerKey, region.regionId));
  }

  render() {
    const { imageSet, instanceTypeSet, networkSet } = this.props.context;
    if (!(imageSet && instanceTypeSet && networkSet)) {
      return <div />;
    }
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('pageInstanceNew.createInstance')}
            </h3>
            <InstanceNewForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
