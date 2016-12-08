import React from 'react';
import { reduxForm } from 'redux-form';
import { translate } from 'react-i18next';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { username, email, password },
    handleSubmit,
    resetForm,
    submitting,
    submitFailed,
  } = props;
  const { t } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className={submitFailed && username.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('username')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...username} />
          {submitFailed && username.error && <div className="text-danger"><small>{username.error}</small></div>}
        </div>
      </div>
      <div className={submitFailed && email.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('email')}</label>
        <div className="col-sm-10">
          <input type="email" className="form-control" {...email} />
          {submitFailed && email.error && <div className="text-danger"><small>{email.error}</small></div>}
        </div>
      </div>
      <div className={submitFailed && password.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('password')}</label>
        <div className="col-sm-10">
          <input type="password" className="form-control" {...password} />
          {submitFailed && password.error && <div className="text-danger"><small>{password.error}</small></div>}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
        </button>
        <button type="button" className="btn pull-right" disabled={submitting} onClick={resetForm}>
          {t('reset')}
        </button>
      </div>
    </form>
  );
};

F.validate = values => {
  const errors = {};
  errors.username = Validations.required(values.username);
  errors.email = Validations.required(values.email) || Validations.email(values.email);
  errors.password = Validations.required(values.password);
  return errors;
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

export default reduxForm({
  form: 'UserForm',
  fields: ['username', 'email', 'password'],
  validate: F.validate,
})(translate()(F));
