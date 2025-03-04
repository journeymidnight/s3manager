import React from 'react';
import Select from 'react-select';
import IAM, { serviceKeyLCS, serviceKeyLOS } from '../services/iam';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

class F extends React.Component {

  constructor(props) {
    super(props);

    this.onBlur = this.onBlur.bind(this);
  }

  onBlur() {
    this.props.fields.regionId.onBlur(this.props.fields.regionId.value);
  }

  getOptions(input, callback) {
    IAM
    .describeRegions({
      searchWord: input,
    })
    .promise
    .then((payload) => {
      callback(null, {
        options: payload.regionSet.map((region) => {
          return {
            value: region.regionId,
            label: `${region.regionName} (${region.regionId})`,
          };
        }),
      });
    })
    .catch(() => {
    });
  }

  render() {
    const { fields:
      { serviceKey, regionId, publicEndpoint},
      handleSubmit,
      resetForm,
      submitting,
      submitFailed,
      isUpdate,
      t,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={submitFailed && serviceKey.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formServiceForm.serviceKey')}</label>
          <div className="col-sm-10">
            <select className="form-control" {...serviceKey} disabled={isUpdate}>
              <option value={serviceKeyLOS}>{t(`services.${serviceKeyLOS}`)}</option>
            </select>
          </div>
        </div>

        <div className={submitFailed && regionId.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formServiceForm.regionId')}</label>
          <div className="col-sm-10">
            <Select.Async
              disabled={isUpdate}
              loadOptions={this.getOptions}
              noResultsText={t('nothingHere')}
              {...regionId}
              onBlur={this.onBlur}
            />
            {submitFailed && regionId.error && <div className="text-danger"><small>{regionId.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && publicEndpoint.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formServiceForm.publicEndpoint')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...publicEndpoint} />
            {submitFailed && publicEndpoint.error && <div className="text-danger"><small>{publicEndpoint.error}</small></div>}
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
  errors.regionId = Validations.required(values.regionId);
  errors.publicEndpoint = Validations.required(values.publicEndpoint);
  return errors;
};

export default reduxForm({
  form: 'ServiceForm',
  fields: ['serviceKey', 'regionId', 'publicEndpoint'],
  validate: F.validate,
})(translate()(F));
