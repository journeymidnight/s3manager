import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as EipActions from '../redux/actions.eip';

class C extends RegionPage {

  componentDidMount() {
    const { dispatch, region, routerKey, routeParams } = this.props;
    dispatch(EipActions.requestDescribeEips(routerKey, region.regionId, { eipIds: [routeParams.eipId] }));
  }

  render() {
    const currentEip = (this.props.context.eipSet && this.props.context.eipSet[0]) || {};
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div><span>{t('id')}: </span><span>{currentEip.eipId}</span></div>
            <div><span>{t('name')}: </span><span>{currentEip.name}</span></div>        
            <div><span>{t('description')}: </span><span>{currentEip.description}</span></div>
            <div><span>{t('address')}: </span><span>{currentEip.address}</span></div>
            <div><span>{t('status')}: </span><span>{currentEip.status}</span></div>
            <div><span>{t('created')}: </span><span>{currentEip.created}</span></div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
