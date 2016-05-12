import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import { tenantRoleAdmin, tenantRoleUser } from '../services/boss';
import * as Actions from '../redux/actions';
import * as TenantActions from '../redux/actions.tenant';
import * as Validations from '../../shared/utils/validations';
import TenantForm from '../forms/TenantForm';

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
        {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('add')}
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

const UserSelectForm = reduxForm({
  form: 'UserSelectForm',
  fields: ['email', 'role'],
  initialValues: { role: tenantRoleUser.toString() },
  validate: F.validate,
})(translate()(F));

class C extends React.Component {

  componentDidMount() {
    const { params, dispatch } = this.props;

    this.tenantId = params.tenantId;
    dispatch(TenantActions.requestDescribeTenant(this.tenantId));
    dispatch(TenantActions.requestDescribeTenantRoles(this.tenantId));

    this.onSave = this.onSave.bind(this);
    this.onCreateRole = this.onCreateRole.bind(this);
    this.onDeleteRole = this.onDeleteRole.bind(this);
  }

  onCreateRole(values, dispatch) {
    return new Promise((resolve, reject) => {
      const email = values.email;
      const role = parseInt(values.role, 10);

      dispatch(Actions.requestUserByEmail(email))
      .then((user) => {
        if (user) {
          dispatch(TenantActions.requestCreateTenantRole(this.tenantId, user.userId, role))
          .then(() => {
            resolve();
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

  onDeleteRole(role) {
    return () => {
      const { dispatch } = this.props;
      dispatch(TenantActions.requestDeleteTenantRole(this.tenantId, role.userId));
    };
  }

  onSave(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(TenantActions.requestModifyTenant({
        tenantId: this.tenantId,
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

    const tenant = this.props.context.tenant;
    if (tenant === undefined) {
      return <div />;
    }

    let roles = <div className="nothing-here-block">{t('nothingHere')}</div>;
    if (this.props.context.roles && this.props.context.roles.total > 0) {
      roles = (
        <table className="table">
          <thead>
            <tr>
              <th>{t('id')}</th>
              <th>{t('username')}</th>
              <th>{t('email')}</th>
              <th>{t('role')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {this.props.context.roles.roleSet.map((role) => {
            return (
              <tr key={role.userId}>
                <td>{role.userId}</td>
                <td>
                  <Link to={`/users/${role.userId}`}>
                    <strong>
                    {role.username}
                    </strong>
                  </Link>
                </td>
                <td>{role.email}</td>
                <td>
                {role.role === tenantRoleAdmin && t('tenantRoleAdmin')}
                {role.role === tenantRoleUser && t('tenantRoleUser')}
                </td>
                <td>
                  <a onClick={this.onDeleteRole(role)} className="btn btn-sm btn-close" >
                    <i className="fa fa-close" />
                  </a>
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
            <h3 className="page-title">
              {t('tenant')} {tenant.name}
            </h3>
            <hr />
            <div className="panel panel-default">
              <div className="panel-heading">{t('settings')}</div>
              <div className="errors-holder"></div>
              <div className="panel-body">
                <TenantForm initialValues={tenant} onSubmit={this.onSave} />
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">{t('pageTenant.authorizedUsers')}</div>
              <div className="errors-holder"></div>
              <div className="panel-body">
                {roles}
                <div className="form-actions">
                  <UserSelectForm onSubmit={this.onCreateRole} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  context: React.PropTypes.object,
  params: React.PropTypes.object.isRequired,
  t: React.PropTypes.any,
};

function mapStateToProps(state) {
  return {
    context: state.context,
  };
}

export default connect(mapStateToProps)(translate()(C));
