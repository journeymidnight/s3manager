import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { translate } from 'react-i18next';
import * as Validations from '../utils/validations';

const F = (props) => {
  const { fields:
    { email, password, tenantId },
    error,
    handleSubmit,
    submitting,
    submitFailed,
    tenants,
  } = props;
  const { t } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="flash-container">
        {error && <div className="flash-alert">{error}</div>}
      </div>
      <div className={submitFailed && email.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('email')}</label>
        <input type="email" className="form-control" {...email} />
        {submitFailed && email.error && <div className="text-danger"><small>{email.error}</small></div>}
      </div>
      <div className={submitFailed && password.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('password')}</label>
        <input type="password" className="form-control" {...password} />
        {submitFailed && password.error && <div className="text-danger"><small>{password.error}</small></div>}
      </div>
      {tenants && <div className={submitFailed && tenantId.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('tenant')}</label>
        <select className="form-control" {...tenantId}>
          {tenants.map((tenant) => {
            return <option value={tenant.tenantId} key={tenant.tenantId}>{tenant.name}</option>;
          })}
        </select>
        {submitFailed && tenantId.error && <div className="text-danger"><small>{tenantId.error}</small></div>}
      </div>}
      <div className="prepend-top-20">
        <button type="submit" className="btn btn-create" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('login')}
        </button>
      </div>
    </form>
  );
};

F.validate = values => {
  const errors = {};
  errors.email = Validations.required(values.email) || Validations.email(values.email);
  errors.password = Validations.required(values.password);
  return errors;
};

F.propTypes = {
  fields: PropTypes.object.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  tenants: React.PropTypes.any,
  t: React.PropTypes.any,
};

export default reduxForm({
  form: 'LoginForm',
  fields: ['email', 'password', 'tenantId'],
  validate: F.validate,
})(translate()(F));
