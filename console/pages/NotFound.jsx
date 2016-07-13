import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';

class C extends Page {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(push('/'));
  }

  render() {
    return <div />;
  }
}

export default attach(C);
