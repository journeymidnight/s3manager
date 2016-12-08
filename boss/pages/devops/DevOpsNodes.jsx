import React from 'react';
import Page, { attach } from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';

class C extends Page {

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));
  }

  render() {
    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
