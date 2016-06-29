import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';

class C extends Page {
  render() {
    return (
      <div>
        Monitor
      </div>
    );
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('volumeManage'), `/${region.regionId}/volumes`));
  }
}

export default attach(C);
