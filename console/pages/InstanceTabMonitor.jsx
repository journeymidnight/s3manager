import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';

class C extends Page {
  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `/${region.regionId}/instances`));

    this.refresh();
  }

  refresh() {
  }

  render() {
    return (
      <div />
    );
  }
}

export default attach(C);
