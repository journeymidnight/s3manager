import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';

class C extends RegionPage {
  render() {
    return (
      <div />
    );
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `/${region.regionId}/instances`));
  }
}

export default attach(C);
