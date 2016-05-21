import React from 'react';
import { Link } from 'react-router';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as NetworkActions from '../redux/actions.network';

class C extends RegionPage {

  componentDidMount() {
    const { dispatch, region, routerKey } = this.props;
    dispatch(NetworkActions.requestDescribeNetworks(routerKey, region.regionId));
  }

  render() {
    const networks = this.props.context.networkSet && this.props.context.networkSet.map((network) => {
      return (
        <tr key={network.networkId}>
          <td>{network.networkId}</td>
          <td>
            <Link to={`/${this.props.region.regionId}/networks/${network.networkId}`}>
              <strong>
                {network.name}
              </strong>
            </Link>
          </td>
          <td className="light">{network.created}</td>
        </tr>
      );
    });
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('networkManage')}
            </h3>
            <div className="top-area">
              <div className="nav-text">
                <p className="light">
                  {t('networkManageDescription')}
                </p>
              </div>
              <div className="nav-controls">
                <Link className="btn btn-new" to={`/${this.props.region.regionId}/networks/create`}>
                  <i className="fa fa-plus"></i>&nbsp;{t('create')}
                </Link>
              </div>
            </div>
            <div className="table-holder">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('id')}</th>
                    <th>{t('name')}</th>
                    <th>{t('created')}</th>
                  </tr>
                </thead>
                <tbody>
                {networks}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
