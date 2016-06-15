import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';
import * as TenantActions from '../redux/actions.tenant';

class C extends Page {

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('tenantManage'), '/tenants'));
  }

  refresh() {
    const { params, dispatch } = this.props;
    this.tenantId = params.tenantId;
    dispatch(TenantActions.requestDescribeTenant(this.tenantId))
    .then(() => {
      this.tenant = this.props.context.tenant;
    });
  }

  render() {
    const { t, params } = this.props;

    const tenant = this.props.context.tenant || this.tenant;
    if (!tenant || tenant.tenantId !== params.tenantId) {
      this.refresh();

      return <div />;
    }

    let active = 'basic';
    if (_.endsWith(this.props.location.pathname, 'users')) {
      active = 'users';
    } else if (_.endsWith(this.props.location.pathname, 'basic')) {
      active = 'basic';
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                <i className="light">
                  {tenant.tenantId}
                </i>
              </div>

              <ul className="nav-links pull-right">
                <li className={`pull-right ${(active === 'users') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/tenants/${tenant.tenantId}/users`}>
                    {t('pageTenant.authorizedUsers')}
                  </Link>
                </li>
                <li className={`pull-right ${(active === 'basic') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/tenants/${tenant.tenantId}/basic`}>
                    {t('pageTenant.basic')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              {React.cloneElement(this.props.children, { tenant })}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
