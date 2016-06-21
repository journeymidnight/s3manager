import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import * as RegionActions from '../redux/actions.region';

class C extends Page {

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));
  }

  refresh() {
    const { params, dispatch } = this.props;
    this.regionId = params.regionId;
    dispatch(RegionActions.requestDescribeRegion(this.regionId))
    .then(() => {
      this.region = this.props.context.region;
    });
  }

  render() {
    const { t, params } = this.props;

    const region = this.props.context.region || this.region;
    if (!region || region.regionId !== params.regionId) {
      this.refresh();

      return <div />;
    }

    let active = 'basic';
    if (_.endsWith(this.props.location.pathname, 'tenants')) {
      active = 'tenants';
    } else if (_.endsWith(this.props.location.pathname, 'images')) {
      active = 'images';
    } else if (_.endsWith(this.props.location.pathname, 'instance_types')) {
      active = 'instanceTypes';
    } else if (_.endsWith(this.props.location.pathname, 'basic')) {
      active = 'basic';
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                <i>{region.regionId}</i>
              </div>

              <ul className="nav-links pull-right">
                <li className={`pull-right ${(active === 'images') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/regions/${region.regionId}/images`}>
                    {t('pageRegion.images')}
                  </Link>
                </li>
                <li className={`pull-right ${(active === 'tenants') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/regions/${region.regionId}/tenants`}>
                    {t('pageRegion.assignedTenants')}
                  </Link>
                </li>
                <li className={`pull-right ${(active === 'instanceTypes') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/regions/${region.regionId}/instance_types`}>
                    {t('pageRegion.instanceTypes')}
                  </Link>
                </li>
                <li className={`pull-right ${(active === 'basic') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/regions/${region.regionId}/basic`}>
                    {t('pageRegion.basic')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              {React.cloneElement(this.props.children, { region2: region })}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);

/*
    dispatch(RegionActions.requestDescribeAssignedQuotas(this.regionId));

  render() {
    const { t } = this.props;

    const region = this.props.context.region;
    if (region === undefined) {
      return <div />;
    }

    let tenants = <div className="nothing-here-block">{t('nothingHere')}</div>;
    if (this.props.context.quotas && this.props.context.quotas.total > 0) {
      tenants = (
        <table className="table">
          <thead>
            <tr>
              <th>{t('id')}</th>
              <th>{t('name')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {this.props.context.quotas.tenantQuotaSet.map((tenant) => {
            return (
              <tr key={tenant.tenantId}>
                <td>{tenant.tenantId}</td>
                <td>
                  <Link to={`/tenants/${tenant.tenantId}`}>
                    <strong>
                    {tenant.name}
                    </strong>
                  </Link>
                </td>
                <td>
                  <Link className="btn btn-sm btn-close" to={`/regions/${this.regionId}/${tenant.tenantId}/`}>
                    <i className="fa fa-cog" /> 配置
                  </Link>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      );
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <ol className="breadcrumb">
              <li><Link to="/regions">{t('regionManage')}</Link></li>
              <li className="active">{region.name}</li>
            </ol>
            <div className="panel panel-default">
              <div className="panel-heading">{t('settings')}</div>
              <div className="errors-holder"></div>
              <div className="panel-body">
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">{t('pageRegion.assignedTenants')}</div>
              <div className="errors-holder"></div>
              <div className="panel-body">
                {tenants}
                <div className="form-actions">
                  <Link className="btn btn-save" to={`/regions/${this.regionId}/create`}>
                    {t('create')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
*/
