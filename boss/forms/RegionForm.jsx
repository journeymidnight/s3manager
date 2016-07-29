import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { regionId, name, devopsEndpoint },
    handleSubmit,
    resetForm,
    submitting,
    submitFailed,
    isUpdate,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className={submitFailed && regionId.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('id')}</label>
        <div className="col-sm-10">
          <input type="text" disabled={isUpdate} className="form-control" {...regionId} />
          {submitFailed && regionId.error && <div className="text-danger"><small>{regionId.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && name.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('name')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...name} />
          {submitFailed && name.error && <div className="text-danger"><small>{name.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && devopsEndpoint.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.devopsEndpoint')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...devopsEndpoint} />
          {submitFailed && devopsEndpoint.error && <div className="text-danger"><small>{devopsEndpoint.error}</small></div>}
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

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  isUpdate: React.PropTypes.bool,
  t: React.PropTypes.any,
};

F.validate = values => {
  const errors = {};
  errors.regionId = Validations.required(values.regionId);
  errors.name = Validations.required(values.name);
  errors.devopsEndpoint = Validations.required(values.devopsEndpoint);
  return errors;
};

export default reduxForm({
  form: 'RegionForm',
  fields: ['regionId', 'name', 'devopsEndpoint'],
  validate: F.validate,
})(translate()(F));
