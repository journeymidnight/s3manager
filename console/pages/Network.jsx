import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import NetworkTabBasic from './NetworkTabBasic';
import NetworkTabRouter from './NetworkTabRouter';
import NetworkTabSubnets from './NetworkTabSubnets';
import * as Actions from '../redux/actions';
import * as NetworkActions from '../redux/actions.network';

class C extends RegionPage {

  constructor(props) {
    super(props);

    this.changeTab = this.changeTab.bind(this);
    this.state = {
      activeTab: 'basic',
    };
    this.refresh = this.refresh.bind(this);
  }

  refresh() {
  }

  changeTab(tab) {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      this.setState({ activeTab: tab });
    };
  }

  componentDidMount() {
    const { t, dispatch, region, routerKey, params } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), `/${region.regionId}/networks`));

    this.networkId = params.networkId;
    dispatch(NetworkActions.requestDescribeNetwork(routerKey, region.regionId, this.networkId));

    this.changeTab('basic')();
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
            <div className="header">
              <ul className="nav-links clearfix">
                <li>
                  <h3 className="page-title">
                    {network.name}
                    <span className={`i-status i-status-${network.status}`}>
                      <i className="icon"></i>
                    </span>
                  </h3>
                </li>
                {[{
                  id: 'subnet',
                  title: t('pageNetwork.subnet'),
                }, {
                  id: 'router',
                  title: t('pageNetwork.router'),
                }, {
                  id: 'basic',
                  title: t('pageNetwork.basic'),
                }].map((tab) => {
                  return (
                    <li className={`pull-right ${this.state.activeTab === tab.id ? 'active' : ''}`} key={tab.id}>
                      <a data-placement="left" href onClick={this.changeTab(tab.id)}>
                        {tab.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="prepend-top-10">
              {this.state.activeTab === 'basic' &&
                <NetworkTabBasic network={network} />}
              {this.state.activeTab === 'subnet' &&
                <NetworkTabSubnets network={network} />}
              {this.state.activeTab === 'router' &&
                <NetworkTabRouter network={network} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
