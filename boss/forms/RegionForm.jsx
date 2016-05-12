import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { regionId, name, opKeystoneEndpoint, opAdminName, opAdminPassword },
    handleSubmit,
    submitting,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className={regionId.touched && regionId.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('id')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...regionId} />
          {regionId.touched && regionId.error && <div className="text-danger"><small>{regionId.error}</small></div>}
        </div>
      </div>

      <div className={name.touched && name.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('name')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...name} />
          {name.touched && name.error && <div className="text-danger"><small>{name.error}</small></div>}
        </div>
      </div>

      <div className={opKeystoneEndpoint.touched && opKeystoneEndpoint.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.opKeystoneEndpoint')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...opKeystoneEndpoint} />
          {opKeystoneEndpoint.touched && opKeystoneEndpoint.error && <div className="text-danger"><small>{opKeystoneEndpoint.error}</small></div>}
        </div>
      </div>

      <div className={opAdminName.touched && opAdminName.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.opAdminName')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...opAdminName} />
          {opAdminName.touched && opAdminName.error && <div className="text-danger"><small>{opAdminName.error}</small></div>}
        </div>
      </div>

      <div className={opAdminPassword.touched && opAdminPassword.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formRegionForm.opAdminPassword')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...opAdminPassword} />
          {opAdminPassword.touched && opAdminPassword.error && <div className="text-danger"><small>{opAdminPassword.error}</small></div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('save')}
        </button>
        &nbsp;
        <a className="btn btn-cancel" href="/tenants">
          {t('cancel')}
        </a>
      </div>
    </form>
  );
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
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
