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
  }

  refresh() {
    const { dispatch, region, routerKey, params } = this.props;

    const instanceId = params.instanceId;
    dispatch(InstanceActions.requestDescribeInstance(routerKey, region.regionId, instanceId))
    .then(() => {
      this.instance = this.props.context.instance;
    });
  }

  isEnabled() {
    const { instance } = this.instance;
    return instance.status !== 'deleted' && instance.status !== 'ceased' && instance.status !== 'error';
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `/${region.regionId}/instances`));

    this.setInterval(() => {
      this.refresh();
    }, 1000);
  }

  render() {
    const { t, region, params } = this.props;

    const instance = this.props.context.instance || this.instance;
    if (!instance || instance.instanceId !== params.instanceId) {
      this.refresh();

      return <div />;
    }

    let active = 'basic';
    if (_.endsWith(this.props.location.pathname, 'console')) {
      active = 'console';
    } else if (_.endsWith(this.props.location.pathname, 'monitor')) {
      active = 'monitor';
    } else if (_.endsWith(this.props.location.pathname, 'output')) {
      active = 'output';
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
                <li className={`pull-right ${(active === 'console') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/console`}>
                    {t('pageInstance.console')}
                  </Link>
                </li>
                <li className={`pull-right ${(active === 'output') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/output`}>
                    {t('pageInstance.output')}
                  </Link>
                </li>
                <li className={`pull-right ${(active === 'monitor') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/monitor`}>
                    {t('pageInstance.monitor')}
                  </Link>
                </li>
                <li className={`pull-right ${(active === 'basic') ? 'active' : ''}`}>
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
