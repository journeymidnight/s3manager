import React from 'react';
import { Link } from 'react-router';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as InstanceActions from '../redux/actions.instance';

class C extends RegionPage {

  componentDidMount() {
    const { dispatch, region, routerKey } = this.props;
    dispatch(InstanceActions.requestDescribeInstances(routerKey, region.regionId));
  }

  render() {
    const instances = this.props.context.instanceSet && this.props.context.instanceSet.map((instance) => {
      return (
        <tr key={instance.instanceId}>
          <td>{instance.instanceId}</td>
          <td>
            <Link to={`/${this.props.region.regionId}/instances/${instance.instanceId}`}>
              <strong>
                {instance.name}
              </strong>
            </Link>
          </td>
          <td className="light">{instance.created}</td>
        </tr>
      );
    });
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('instanceManage')}
            </h3>
            <div className="top-area">
              <div className="nav-text">
                <p className="light">
                  {t('instanceManageDescription')}
                </p>
              </div>
              <div className="nav-controls">
                <Link className="btn btn-new" to={`/${this.props.region.regionId}/instances/new`}>
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
                {instances}
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
