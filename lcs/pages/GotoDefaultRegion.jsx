import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';

class C extends Page {

  initialize() {
    const { dispatch, service } = this.props;
    dispatch(push(`${service.servicePath}`));
  }

  render() {
    return <div />;
  }
}

export default attach(C);
