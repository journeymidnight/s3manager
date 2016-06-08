import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';
import * as NetworkActions from '../redux/actions.network';

class C extends RegionPage {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
  }

  refresh() {
  }

  notDeleted() {
    const { network } = this.network;
    return network.status !== 'deleted' && network.status !== 'ceased';
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), `/${region.regionId}/networks`));
  }

  render() {
    const { t, dispatch, region, routerKey, params } = this.props;

    const network = this.props.context.network || this.network;
    if (!network || network.networkId !== params.networkId) {
      const networkId = params.networkId;
      dispatch(NetworkActions.requestDescribeNetwork(routerKey, region.regionId, networkId))
      .then(() => {
        this.network = this.props.context.network;
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
                    {network.networkId}
                  </h3>
                </li>
                <li className={`pull-right ${_.endsWith(this.props.location.pathname, 'subnets') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/${region.regionId}/networks/${network.networkId}/subnets`}>
                    {t('pageNetwork.subnets')}
                  </Link>
                </li>
                <li className={`pull-right ${_.endsWith(this.props.location.pathname, 'router') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/${region.regionId}/networks/${network.networkId}/router`}>
                    {t('pageNetwork.router')}
                  </Link>
                </li>
                <li className={`pull-right ${!(_.endsWith(this.props.location.pathname, 'router') || _.endsWith(this.props.location.pathname, 'subnets')) ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/${region.regionId}/networks/${network.networkId}/`}>
                    {t('pageNetwork.basic')}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="prepend-top-10">
              {React.cloneElement(this.props.children, { network })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
