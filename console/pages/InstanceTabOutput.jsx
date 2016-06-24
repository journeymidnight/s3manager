import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import * as InstanceActions from '../redux/actions.instance';

class C extends Page {

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `/${region.regionId}/instances`));

    this.setInterval(() => {
      this.refresh();
    }, 2000);

    this.refresh();
  }

  refresh() {
    const { routerKey, dispatch, region, params } = this.props;
    dispatch(InstanceActions.requestInstanceOutput(routerKey, region.regionId, params.instanceId));
  }

  render() {
    return (
      <div>
        {this.props.context.output && <pre className="console_output">
          {this.props.context.output}
        </pre>}
      </div>
    );
  }
}

export default attach(C);
