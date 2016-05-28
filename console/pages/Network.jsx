import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as NetworkActions from '../redux/actions.network';

class C extends RegionPage {

  componentDidMount() {
    const { dispatch, region, routerKey, params } = this.props;

    this.networkId = params.networkId;
    dispatch(NetworkActions.requestDescribeNetwork(routerKey, region.regionId, this.networkId));
  }

  componentWillUnmount() {
  }

  render() {
    const { t } = this.props;
    const network = this.props.context.network;

    if (!network) {
      return <div />;
    }
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {network.name}
            </h3>
            <hr />
            <div className="clearfix detail-page-header">
              <div className="header">
                <ul className="nav-links">
                  <li className="home active">
                    <a data-placement="right" href="#">{t('pageNetwork.subnet')}</a>
                  </li>
                  <li className="">
                    <a data-placement="right" href="#">{t('pageNetwork.router')}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
