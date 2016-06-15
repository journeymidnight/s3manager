import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import { tenantRoleAdmin, tenantRoleUser } from '../services/boss';
import { attach } from '../../shared/pages/Page';
import ButtonForm from '../../shared/forms/ButtonForm';
import TablePage from '../../shared/pages/TablePage';
import * as Validations from '../../shared/utils/validations';
import * as Actions from '../redux/actions';
import * as TenantActions from '../redux/actions.tenant';

const F = (props) => {
  const { fields:
    { email, role },
    handleSubmit,
    submitting,
  } = props;
  const { t } = props;
  return (
    <form className="form-inline" onSubmit={handleSubmit}>
      <div className="form-group append-right-5">
        <input type="email" className="form-control" placeholder={t('formUserSelectForm.typeEmail')} {...email} />
      </div>
      <div className="form-group append-right-5">
        <select className="form-control" {...role}>
          <option value={tenantRoleAdmin.toString()}>{t('tenantRoleAdmin')}</option>
          <option value={tenantRoleUser.toString()}>{t('tenantRoleUser')}</option>
        </select>
      </div>
      <button type="submit" className="btn btn-save" disabled={email.error || submitting}>
        {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('create')}
      </button>
    </form>
  );
};

F.validate = values => {
  const errors = {};
  errors.email = Validations.required(values.email);
  errors.role = Validations.required(values.role);
  return errors;
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

export const UserSelectForm = reduxForm({
  form: 'UserSelectForm',
  fields: ['email', 'role'],
  initialValues: { role: tenantRoleUser.toString() },
  validate: F.validate,
})(translate()(F));

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onCreateRole = this.onCreateRole.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('tenantManage'), '/tenants'));

    this.initTable({ isTabPage: true });
  }

  onCreateRole(values) {
    const { tenant, dispatch } = this.props;

    return new Promise((resolve, reject) => {
      const email = values.email;
      const role = parseInt(values.role, 10);

      dispatch(Actions.requestUserByEmail(email))
      .then((user) => {
        if (user) {
          dispatch(TenantActions.requestCreateTenantRole(tenant.tenantId, user.userId, role))
          .then(() => {
            resolve();
            this.onRefresh({}, false)();
          })
          .catch(() => {
            reject();
          });
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
    });
  }

  onDelete() {
    const { dispatch, tenant } = this.props;
    const userIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(TenantActions.requestDeleteTenantRole(tenant.tenantId, userIds))
      .then(() => {
        resolve();
        this.onRefresh({}, false)();
      }).catch(() => {
        reject();
      });
    });
  }

  refreshAction() {
    const { tenant } = this.props;
    return TenantActions.requestDescribeTenantRoles(tenant.tenantId);
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.roleSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.roleSet.map((u) => { return u.userId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('username')}</th>
            <th>{t('email')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.roleSet.map((role) => {
          return (
            <tr key={role.userId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(role.userId)} checked={this.props.context.selected[role.userId] === true} />
              </td>
              <td>
                <Link to={`/users/${role.userId}`}>
                  {role.userId}
                </Link>
              </td>
              <td><strong>{role.username}</strong></td>
              <td>{role.email}</td>
              <td>
              {role.role === tenantRoleAdmin && t('tenantRoleAdmin')}
              {role.role === tenantRoleUser && t('tenantRoleUser')}
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }

  renderFilters() {
    const { t } = this.props;
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="pull-right">
            <UserSelectForm onSubmit={this.onCreateRole} />
          </div>
        </div>
        <div className={Object.keys(this.props.context.selected).length > 0 ? '' : 'hidden'}>
          <div className="filter-item inline">
            <ButtonForm onSubmit={this.onDelete} text={t('delete')} type="btn-danger" />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
