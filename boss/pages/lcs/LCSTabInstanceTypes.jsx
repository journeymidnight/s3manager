import React from 'react';
import Page, { attach } from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';

class C extends Page {

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('serviceManage'), '/services'));
  }

  render() {
    return <div />;
  }
}

export default attach(C);
