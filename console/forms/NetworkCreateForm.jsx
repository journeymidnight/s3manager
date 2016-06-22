import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { name, cidr },
    handleSubmit,
    submitting,
    submitFailed,
    resetForm,
    t,
    invalid,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>

      <div className={submitFailed && name.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('name')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...name} />
          {submitFailed && name.error && <div className="text-danger"><small>{name.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && cidr.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('pageNetworkCreate.cidr')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...cidr} />
          {submitFailed && cidr.error && <div className="text-danger"><small>{cidr.error}</small></div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-save" disabled={submitting || invalid}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('create')}
        </button>
        &nbsp;
        <button type="button" className="btn btn-cancel" disabled={submitting} onClick={resetForm}>
          {t('reset')}
        </button>
      </div>
    </form>
  );
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

F.validate = values => {
  const errors = {};
  errors.cidr = Validations.required(values.cidr);
  return errors;
};

export default reduxForm({
  form: 'NetworkCreateForm',
  fields: ['name', 'cidr'],
  validate: F.validate,
})(translate()(F));
