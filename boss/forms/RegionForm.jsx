import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { regionId, name, opKeystoneEndpoint, opAdminName, opAdminPassword },
    handleSubmit,
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

      <div className={submitFailed && opKeystoneEndpoint.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.opKeystoneEndpoint')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...opKeystoneEndpoint} />
          {submitFailed && opKeystoneEndpoint.error && <div className="text-danger"><small>{opKeystoneEndpoint.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && opAdminName.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.opAdminName')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...opAdminName} />
          {submitFailed && opAdminName.error && <div className="text-danger"><small>{opAdminName.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && opAdminPassword.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.opAdminPassword')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...opAdminPassword} />
          {submitFailed && opAdminPassword.error && <div className="text-danger"><small>{opAdminPassword.error}</small></div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('save')}
        </button>
        &nbsp;
        <Link className="btn btn-cancel" to="/regions">
          {t('cancel')}
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
  isUpdate: React.PropTypes.bool,
  t: React.PropTypes.any,
};

F.validate = values => {
  const errors = {};
  errors.regionId = Validations.required(values.regionId);
  errors.name = Validations.required(values.name);
  errors.opKeystoneEndpoint = Validations.required(values.opKeystoneEndpoint);
  errors.opAdminName = Validations.required(values.opAdminName);
  errors.opAdminPassword = Validations.required(values.opAdminPassword);
  return errors;
};

export default reduxForm({
  form: 'RegionForm',
  fields: ['regionId', 'name', 'opKeystoneEndpoint', 'opAdminName', 'opAdminPassword'],
  validate: F.validate,
})(translate()(F));
