import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';


let InstanceCaptureForm = (props) => {
  const { fields:
    { name },
    handleSubmit,
    submitting,
    submitFailed,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">

        <div className={(submitFailed || name.touched) && name.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('name')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...name} maxLength="50" />
            {(submitFailed || name.touched) && name.error && <div className="text-danger"><small>{name.error}</small></div>}
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

InstanceCaptureForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

InstanceCaptureForm.validate = (values) => {
  const errors = {};
  errors.name = Validations.required(values.name);
  return errors;
};

InstanceCaptureForm = reduxForm({
  form: 'InstanceCaptureForm',
  fields: ['name'],
  validate: InstanceCaptureForm.validate,
})(translate()(InstanceCaptureForm));

export default InstanceCaptureForm;
