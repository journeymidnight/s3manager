import React from 'react';
import Page, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';

class C extends Page {

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));
  }

  render() {
    return <div />;
  }
}

export default attach(C);
