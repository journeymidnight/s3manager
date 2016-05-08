import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import * as Validations from '../utils/validations';

const F = (props) => {
  const { fields:
    { email, password },
    error,
    submitting,
  } = props;
  return (
    <form>
      <div className="flash-container">
        {error && <div className="flash-alert">{error}</div>}
      </div>
      <div className={email.touched && email.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >邮箱</label>
        <input type="email" className="form-control" placeholder="输入邮箱" {...email} />
        {email.touched && email.error && <div className="text-danger"><small>{email.error}</small></div>}
      </div>
      <div className={password.touched && password.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >密码</label>
        <input type="password" className="form-control" placeholder="输入密码" {...password} />
        {password.touched && password.error && <div className="text-danger"><small>{password.error}</small></div>}
      </div>
      <div className="prepend-top-20">
        <button type="submit" className="btn btn-create" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} 登录
        </button>
      </div>
    </form>
  );
};

F.propTypes = {
  fields: PropTypes.object.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

F.validate = values => {
  const errors = {};
  errors.email = Validations.required(values.email) || Validations.email(values.email);
  errors.password = Validations.required(values.password);
  return errors;
};

export default reduxForm({
  form: 'login',
  fields: ['email', 'password'],
  validate: F.validate,
})(F);
