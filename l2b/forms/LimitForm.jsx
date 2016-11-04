import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const LimitForm = (props) => {
  const { fields:
    {
      connectionLimit,
    },
    handleSubmit,
    submitting,
    submitFailed,
    t,
  } = props;

  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className={(submitFailed || connectionLimit.touched) && connectionLimit.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('pageLoadBalancer.connectionLimit')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" placeholder={t('pageLoadBalancer.connectionLimitRange')} min="-1" {...connectionLimit} />
            {(submitFailed || connectionLimit.touched) && connectionLimit.error && <div className="text-danger"><small>{connectionLimit.error}</small></div>}
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
        </button>
      </div>
    </form>
  );
};

LimitForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

LimitForm.validate = values => {
  const errors = {};
  errors.connectionLimit = Validations.connectionLimit(values.connectionLimit);
  return errors;
};

export default reduxForm({
  form: 'LimitForm',
  fields: [
    'connectionLimit',
  ],
  validate: LimitForm.validate,
})(translate()(LimitForm));
