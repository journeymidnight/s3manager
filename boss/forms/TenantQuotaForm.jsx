import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Select from 'react-select';
import BOSS from '../services/boss';
import * as Validations from '../../shared/utils/validations';

class F extends React.Component {

  constructor(props) {
    super(props);

    this.onBlur = this.onBlur.bind(this);
  }

  onBlur() {
    this.props.fields.tenantId.onBlur(this.props.fields.tenantId.value);
  }

  getOptions(input, callback) {
    BOSS
    .describeTenants({
      searchWord: input,
    })
    .promise
    .then((payload) => {
      callback(null, {
        options: payload.tenantSet.map((tenant) => {
          return {
            value: tenant.tenantId,
            label: `${tenant.name} (${tenant.tenantId})`,
          };
        }),
      });
    })
    .catch(() => {
    });
  }

  render() {
    const {
      fields: {
        tenantId,
        quotaInstances,
        quotaVCPUs,
        quotaMemory,
        quotaImages,
        quotaEIPs,
        quotaVolumes,
        quotaVolumeSize,
        quotaKeyPairs,
      },
      handleSubmit,
      resetForm,
      submitting,
      submitFailed,
      isUpdate,
      t,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={submitFailed && tenantId.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formTenantQuotaForm.tenantId')}</label>
          <div className="col-sm-10">
            <Select.Async
              loadOptions={this.getOptions}
              noResultsText={t('nothingHere')}
              disabled={isUpdate}
              {...tenantId}
              onBlur={this.onBlur}
            />
            {submitFailed && tenantId.error && <div className="text-danger"><small>{tenantId.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && quotaInstances.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formTenantQuotaForm.quotaInstances')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...quotaInstances} />
            {submitFailed && quotaInstances.error && <div className="text-danger"><small>{quotaInstances.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && quotaVCPUs.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formTenantQuotaForm.quotaVCPUs')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...quotaVCPUs} />
            {submitFailed && quotaVCPUs.error && <div className="text-danger"><small>{quotaVCPUs.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && quotaMemory.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formTenantQuotaForm.quotaMemory')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...quotaMemory} />
            {submitFailed && quotaMemory.error && <div className="text-danger"><small>{quotaMemory.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && quotaImages.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formTenantQuotaForm.quotaImages')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...quotaImages} />
            {submitFailed && quotaImages.error && <div className="text-danger"><small>{quotaImages.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && quotaEIPs.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formTenantQuotaForm.quotaEIPs')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...quotaEIPs} />
            {submitFailed && quotaEIPs.error && <div className="text-danger"><small>{quotaEIPs.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && quotaVolumes.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formTenantQuotaForm.quotaVolumes')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...quotaVolumes} />
            {submitFailed && quotaVolumes.error && <div className="text-danger"><small>{quotaVolumes.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && quotaVolumeSize.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formTenantQuotaForm.quotaVolumeSize')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...quotaVolumeSize} />
            {submitFailed && quotaVolumeSize.error && <div className="text-danger"><small>{quotaVolumeSize.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && quotaKeyPairs.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formTenantQuotaForm.quotaKeyPairs')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...quotaKeyPairs} />
            {submitFailed && quotaKeyPairs.error && <div className="text-danger"><small>{quotaKeyPairs.error}</small></div>}
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
  }
}

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
  errors.tenantId = Validations.required(values.tenantId);
  errors.quotaInstances = Validations.required(values.quotaInstances);
  errors.quotaVCPUs = Validations.required(values.quotaVCPUs);
  errors.quotaMemory = Validations.required(values.quotaMemory);
  errors.quotaImages = Validations.required(values.quotaImages);
  errors.quotaEIPs = Validations.required(values.quotaEIPs);
  errors.quotaVolumes = Validations.required(values.quotaVolumes);
  errors.quotaVolumeSize = Validations.required(values.quotaVolumeSize);
  errors.quotaKeyPairs = Validations.required(values.quotaKeyPairs);
  return errors;
};

export default reduxForm({
  form: 'TenantForm',
  fields: [
    'tenantId',
    'quotaInstances',
    'quotaVCPUs',
    'quotaMemory',
    'quotaImages',
    'quotaEIPs',
    'quotaVolumes',
    'quotaVolumeSize',
    'quotaKeyPairs',
  ],
  validate: F.validate,
})(translate()(F));
