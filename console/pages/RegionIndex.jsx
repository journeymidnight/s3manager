import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';

class C extends Page {

  componentDidMount() {
    const { params, dispatch } = this.props;
    const regionId = params.regionId;
    dispatch(push(`/${regionId}/overview`));
  }

  render() {
    return <div />;
  }
}

export default attach(C);
