import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as KeyPairActions from '../redux/actions.key_pair';

class C extends RegionPage {

  componentDidMount() {
    const { dispatch, region, routerKey, routeParams } = this.props;
    dispatch(KeyPairActions.requestDescribeKeyPairs(routerKey, region.regionId, { keyPairIds: [routeParams.keyPairId] }));
  }

  render() {
    const currentKeyPair = (this.props.context.keyPairSet && this.props.context.keyPairSet[0]) || {};
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div><span>{t('id')}: </span><span>{currentKeyPair.keyPairId}</span></div>
            <div><span>{t('name')}: </span><span>{currentKeyPair.name}</span></div>
            <div><span>{t('created')}: </span><span>{currentKeyPair.created}</span></div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
