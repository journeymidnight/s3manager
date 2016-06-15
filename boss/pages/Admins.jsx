import React from 'react';
import Page, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';

class C extends Page {

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), '/networks'));
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default attach(C);
