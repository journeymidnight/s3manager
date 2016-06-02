import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as KeyPairActions from '../redux/actions.key_pair';

class C extends RegionPage {

  componentDidMount() {
    const { dispatch, region, routerKey, routeParams } = this.props;
    dispatch(KeyPairActions.requestDescribeKeyPair(routerKey, region.regionId, routeParams.keyPairId));
  }

  render() {
    const currentKeyPair = this.props.context.keyPair2 || {};
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div><span>ID: </span><span>{currentKeyPair.keyPairId}</span></div>
            <div><span>名称: </span><span>{currentKeyPair.name}</span></div>
            <div><span>创建时间: </span><span>{currentKeyPair.created}</span></div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
