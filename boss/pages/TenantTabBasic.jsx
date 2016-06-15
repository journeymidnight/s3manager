import React from 'react';
import Page, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';
import TenantForm from '../forms/TenantForm';
import * as TenantActions from '../redux/actions.tenant';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('tenantManage'), '/tenants'));
  }

  onSave(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(TenantActions.requestModifyTenant({
        tenantId: this.props.tenant.tenantId,
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
    const { t, tenant } = this.props;
    return (
      <div className="panel panel-default prepend-top-20">
        <div className="panel-heading">{t('settings')}</div>
        <div className="errors-holder"></div>
        <div className="panel-body">
          <TenantForm initialValues={tenant} onSubmit={this.onSave} />
        </div>
      </div>
    );
  }
}

export default attach(C);
