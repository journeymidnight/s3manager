import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as TenantActions from '../redux/actions.tenant';
import * as Actions from '../redux/actions';
import TenantForm from '../forms/TenantForm';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('tenantManage'), '/tenants'));
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(TenantActions.requestCreateTenant({
        name,
        description,
      }))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">

            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span className="light">
                  {t('create') + t('tenant')}
                </span>
              </div>
            </div>

            <TenantForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
