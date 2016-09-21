import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as REGION from '../services/iam';
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
          <select className="form-control" {...regionId} disabled={isUpdate}>
            <option value={REGION.cnNorth1}>{REGION.cnNorth1}</option>
            <option value={REGION.cnNorth2}>{REGION.cnNorth2}</option>
            <option value={REGION.cnEast1}>{REGION.cnEast1}</option>
            <option value={REGION.cnEast2}>{REGION.cnEast2}</option>
            <option value={REGION.cnSouth1}>{REGION.cnSouth1}</option>
            <option value={REGION.cnSouth2}>{REGION.cnSouth2}</option>
            <option value={REGION.apHongkong1}>{REGION.apHongkong1}</option>
            <option value={REGION.usWest1}>{REGION.usWest1}</option>
            <option value={REGION.usEast1}>{REGION.usEast1}</option>
            <option value={REGION.cnTest1}>{REGION.cnTest1}</option>
            <option value={REGION.cnTest2}>{REGION.cnTest2}</option>
          </select>
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
