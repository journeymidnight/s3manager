import React from 'react';
import { Link } from 'react-router';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as KeyPairActions from '../redux/actions.keyPair';

class C extends RegionPage {

  componentDidMount() {
    const { dispatch, region, routerKey } = this.props;
    dispatch(KeyPairActions.requestDescribeKeyPairs(routerKey, region.regionId));
  }

  render() {
    const keyPairs = this.props.context.keyPairSet && this.props.context.keyPairSet.map((keyPair) => {
      return (
        <tr key={keyPair.keyPairId}>
          <td>{keyPair.keyPairId}</td>
          <td>
            <Link to={`/${this.props.region.regionId}/key_pairs/${keyPair.keyPairId}`}>
              <strong>
                {keyPair.name}
              </strong>
            </Link>
          </td>
          <td className="light">{keyPair.created}</td>
        </tr>
      );
    });
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('keyPairManage')}
            </h3>
            <div className="top-area">
              <div className="nav-text">
                <p className="light">
                  {t('keyPairManageDescription')}
                </p>
              </div>
              <div className="nav-controls">
                <Link className="btn btn-new" to={`/${this.props.region.regionId}/key_pairs/new`}>
                  <i className="fa fa-plus"></i>&nbsp;{t('add')}
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
                {keyPairs}
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
