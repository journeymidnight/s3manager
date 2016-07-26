import React from 'react';
import Page, { attach } from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';
import * as DevOpsActions from '../../redux/actions.devops';

class C extends Page {

  componentDidMount() {
    const { t, dispatch, routerKey, region2 } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));

    dispatch(DevOpsActions.requestGetMonitorData(routerKey, region2));
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
