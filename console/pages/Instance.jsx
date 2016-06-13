import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';
import * as InstanceActions from '../redux/actions.instance';

class C extends RegionPage {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.startInstance = this.startInstance.bind(this);
    this.stopInstance = this.stopInstance.bind(this);
  }

  refresh() {
  }

  isEnabled() {
    const { instance } = this.instance;
    return instance.status !== 'deleted' && instance.status !== 'ceased' && instance.status !== 'error';
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `/${region.regionId}/instances`));
  }

  startInstance() {
    const { dispatch, region, routerKey } = this.props;

    dispatch(InstanceActions.requestStartInstance(routerKey, region.regionId, this.instanceId));
  }

  stopInstance() {
    const { dispatch, region, routerKey } = this.props;

    dispatch(InstanceActions.requestStopInstance(routerKey, region.regionId, this.instanceId));
  }

  render() {
    const { t, dispatch, region, routerKey, params } = this.props;

    const instance = this.props.context.instance || this.instance;
    if (!instance || instance.instanceId !== params.instanceId) {
      const instanceId = params.instanceId;
      dispatch(InstanceActions.requestDescribeInstance(routerKey, region.regionId, instanceId))
      .then(() => {
        this.instance = this.props.context.instance;
      });

      return <div />;
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="header">
              <ul className="nav-links clearfix">
                <li>
                  <h3 className="page-title">
                    {instance.instanceId}
                  </h3>
                </li>
                <li className={`pull-right ${_.endsWith(this.props.location.pathname, 'console') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/console`}>
                    {t('pageInstance.console')}
                  </Link>
                </li>
                <li className={`pull-right ${_.endsWith(this.props.location.pathname, 'output') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/output`}>
                    {t('pageInstance.output')}
                  </Link>
                </li>
                <li className={`pull-right ${_.endsWith(this.props.location.pathname, 'monitor') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/monitor`}>
                    {t('pageInstance.monitor')}
                  </Link>
                </li>
                <li className={`pull-right ${!(_.endsWith(this.props.location.pathname, 'console') || _.endsWith(this.props.location.pathname, 'output') || _.endsWith(this.props.location.pathname, 'monitor')) ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/`}>
                    {t('pageInstance.basic')}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="prepend-top-10">
              {React.cloneElement(this.props.children, { instance })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
