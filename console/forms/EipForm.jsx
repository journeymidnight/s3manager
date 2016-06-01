import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { name, count },
    handleSubmit,
    submitting,
    submitFailed,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>

      <div className={submitFailed && name.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('name') }</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...name} />
          {submitFailed && name.error && <div className="text-danger"><small>{name.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && description.count ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('count') }</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...count} />
          {submitFailed && count.error && <div className="text-danger"><small>{count.error}</small></div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update') }
        </button>
        &nbsp;
        <Link className="btn btn-cancel" to="/regions">
          {t('cancel') }
        </Link>
      </div>
    </form>
  );
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

F.validate = values => {
  const errors = {};
  errors.name = Validations.required(values.name);
  errors.count = Validations.integer(values.count);  
  return errors;
};

export default reduxForm({
  form: 'EipForm',
  fields: ['name', 'count'],
  validate: F.validate,
})(translate()(F));
