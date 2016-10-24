import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Slider from '../../shared/components/Slider';
import * as Validations from '../../shared/utils/validations';

const HealthForm = (props) => {
  const { fields:
    {
      healthMonitorDelay,
      healthMonitorTimeout,
      healthMonitorMaxRetries,
    },
    handleSubmit,
    submitting,
    submitFailed,
    t,
  } = props;

  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className={(submitFailed || healthMonitorDelay.touched) && healthMonitorDelay.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('pageLoadBalancer.healthMonitorDelay')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" placeholder={t('pageLoadBalancer.healthMonitorDelayRange')} min="1" max="50" {...healthMonitorDelay} />
            {(submitFailed || healthMonitorDelay.touched) && healthMonitorDelay.error && <div className="text-danger"><small>{healthMonitorDelay.error}</small></div>}
          </div>
        </div>

        <div className={(submitFailed || healthMonitorTimeout.touched) && healthMonitorTimeout.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('pageLoadBalancer.healthMonitorTimeout')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" placeholder={t('pageLoadBalancer.healthMonitorTimeoutRange')} min="1" max="300" {...healthMonitorTimeout} />
            {(submitFailed || healthMonitorTimeout.touched) && healthMonitorTimeout.error && <div className="text-danger"><small>{healthMonitorTimeout.error}</small></div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label" >{t('pageLoadBalancer.healthMonitorMaxRetries')}</label>
          <div className="col-sm-10">
            <input type="hidden" className="form-control" value={healthMonitorMaxRetries.value} disabled="disabled" />
            <Slider min={1} max={10} step={1} value={healthMonitorMaxRetries.value} onChange={param => healthMonitorMaxRetries.onChange(param)} />
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

HealthForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

HealthForm.validate = values => {
  const errors = {};
  errors.healthMonitorDelay = Validations.healthMonitorDelay(values.healthMonitorDelay);
  errors.healthMonitorTimeout = Validations.healthMonitorTimeout(values.healthMonitorTimeout);
  return errors;
};

export default reduxForm({
  form: 'HealthForm',
  fields: [
    'healthMonitorDelay',
    'healthMonitorTimeout',
    'healthMonitorMaxRetries',
  ],
  validate: HealthForm.validate,
})(translate()(HealthForm));
