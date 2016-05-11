import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import * as Actions from '../redux/actions';
import TenantForm from '../forms/TenantForm';
import UserSelectForm from '../forms/UserSelectForm';

class C extends React.Component {

  componentDidMount() {
    const { params, dispatch } = this.props;

    this.tenantId = params.tenantId;
    dispatch(Actions.requestDescribeTenant(this.tenantId));
    dispatch(Actions.requestDescribeTenantRoles(this.tenantId));

    this.onSave = this.onSave.bind(this);
    this.onCreateRole = this.onCreateRole.bind(this);
  }

  onCreateRole(values, dispatch) {
    return new Promise((resolve, reject) => {
      const email = values.email;
      const role = parseInt(values.role, 10);

      dispatch(Actions.requestUserByEmail(email))
      .then((user) => {
        if (user) {
          dispatch(Actions.requestCreateTenantRole(this.tenantId, user.userId, role))
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

  onSave(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(Actions.requestModifyTenant({
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
                {role.role === 1 && t('tenantRoleAdmin')}
                {role.role === 2 && t('tenantRoleUser')}
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
              <div className="panel-heading">{t('pageTenants.authorizedUsers')}</div>
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
