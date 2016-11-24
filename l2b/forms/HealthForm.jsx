import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import NumberInput from '../../shared/components/FormInputs/NumberInput';
import SliderInput from '../../shared/components/FormInputs/SliderInput';
import FooterButtons from '../../shared/components/FormInputs/FooterButtons';
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
    resetForm,
    t,
  } = props;

  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">
        <NumberInput
          item={healthMonitorDelay}
          itemName="pageLoadBalancer.healthMonitorDelay"
          submitFailed={submitFailed}
          inputParams={{ min: '3', max: '100' }}
          helpText={t('pageLoadBalancer.healthMonitorDelayRange')}
          t={t}
        />

        <NumberInput
          item={healthMonitorTimeout}
          itemName="pageLoadBalancer.healthMonitorTimeout"
          submitFailed={submitFailed}
          inputParams={{ min: '3', max: '10' }}
          helpText={t('pageLoadBalancer.healthMonitorTimeoutRange')}
          t={t}
        />

        <SliderInput
          item={healthMonitorMaxRetries}
          itemName="pageLoadBalancer.healthMonitorMaxRetries"
          max={10}
          min={1}
          step={1}
          unit={t('units.count')}
          helpText="pageLoadBalancer.healthMonitorMaxRetriesHint"
          t={t}
        />
      </div>

      <div className="modal-footer">
        <FooterButtons
          resetForm={resetForm}
          submitting={submitting}
          t={t}
        />
      </div>
    </form>
  );
};

HealthForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
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
