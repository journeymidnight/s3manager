import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import * as RegionActions from '../redux/actions.region';

class C extends Page {

  componentDidMount() {
    const { dispatch, routerKey } = this.props;
    dispatch(RegionActions.requestDescribeRegions(routerKey));
  }

  render() {
    const regions = this.props.context.regionSet && this.props.context.regionSet.map((region) => {
      return (
        <tr key={region.regionId}>
          <td>{region.regionId}</td>
          <td>
            <Link to={`/regions/${region.regionId}`}>
              <strong>
                {region.name}
              </strong>
            </Link>
          </td>
          <td className="light">{region.created}</td>
        </tr>
      );
    });
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <ol className="breadcrumb">
              <li className="active">{t('regionManage')}</li>
            </ol>
            <div className="top-area">
              <div className="nav-text">
                <p className="light">
                  {t('regionManageDescription')}
                </p>
              </div>
              <div className="nav-controls">
                <Link className="btn btn-new" to="/regions/create">
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
                {regions}
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
