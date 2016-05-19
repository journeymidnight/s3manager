import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { regionId, name, publicEndpoint, manageEndpoint, manageKey, manageSecret },
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

      <div className={submitFailed && publicEndpoint.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.publicEndpoint')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...publicEndpoint} />
          {submitFailed && publicEndpoint.error && <div className="text-danger"><small>{publicEndpoint.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && manageEndpoint.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.manageEndpoint')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...manageEndpoint} />
          {submitFailed && manageEndpoint.error && <div className="text-danger"><small>{manageEndpoint.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && manageKey.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.manageKey')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...manageKey} />
          {submitFailed && manageKey.error && <div className="text-danger"><small>{manageKey.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && manageSecret.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.manageSecret')}</label>
        <div className="col-sm-10">
          <input type="password" className="form-control" {...manageSecret} />
          {submitFailed && manageSecret.error && <div className="text-danger"><small>{manageSecret.error}</small></div>}
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
  errors.publicEndpoint = Validations.required(values.publicEndpoint);
  errors.manageEndpoint = Validations.required(values.manageEndpoint);
  errors.manageKey = Validations.required(values.manageKey);
  errors.manageSecret = Validations.required(values.manageSecret);
  return errors;
};

export default reduxForm({
  form: 'RegionForm',
  fields: ['regionId', 'name', 'publicEndpoint', 'manageEndpoint', 'manageKey', 'manageSecret'],
  validate: F.validate,
})(translate()(F));
