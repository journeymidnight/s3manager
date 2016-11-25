import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import TextInput from '../../shared/components/FormInputs/TextInput';
import NumberInput from '../../shared/components/FormInputs/NumberInput';
import SliderInput from '../../shared/components/FormInputs/SliderInput';
import SelectInput from '../../shared/components/FormInputs/SelectInput';
import FooterButtons from '../../shared/components/FormInputs/FooterButtons';
import * as Validations from '../../shared/utils/validations';

class ListenerCreateForm extends React.Component {

  constructor() {
    super();

    this.protocols = [
      { value: 'TCP' },
    ];
    this.balanceModes = [
      { name: 'pageLoadBalancer.roundRobin', value: 'WEIGHTED_ROUND_ROBIN' },
      // { name: 'pageLoadBalancer.minConnection', value: 'WEIGHTED_LEAST_CONNECTIONS' },
      { name: 'pageLoadBalancer.sourceIp', value: 'SOURCE_IP' },
    ];
    this.sessionPersistenceModes = [
      { value: 'SOURCE_IP' },
    ];
    this.healthMonitorTypes = [
      { value: 'TCP' },
    ];
  }

  componentDidMount() {
    const initialValues = {
      protocol: 'TCP',
      balanceMode: 'WEIGHTED_ROUND_ROBIN',
      session: false,
      healthMonitorType: 'TCP',
      healthMonitorMaxRetries: 3,
    };

    this.props.initializeForm(initialValues);
  }

  render() {
    const { fields:
      {
        name,
        description,
        protocol,
        port,
        balanceMode,
        // connectionLimit,
        session,
        sessionPersistenceMode,
        healthMonitorType,
        healthMonitorDelay,
        healthMonitorTimeout,
        healthMonitorMaxRetries,
      },
      handleSubmit,
      submitting,
      submitFailed,
      resetForm,
      t,
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-body">
          <TextInput
            item={name}
            itemName="name"
            submitFailed={submitFailed}
            inputParams={{ maxLength: '50' }}
            t={t}
          />

          <TextInput
            item={description}
            itemName="description"
            submitFailed={submitFailed}
            inputParams={{ maxLength: '250' }}
            t={t}
          />

          <SelectInput
            item={protocol}
            itemName="protocol"
            optionList={this.protocols}
            optionValue="value"
            t={t}
          />

          <NumberInput
            item={port}
            itemName="port"
            submitFailed={submitFailed}
            t={t}
          />

          <SelectInput
            item={balanceMode}
            itemName="pageLoadBalancer.balanceMode"
            optionList={this.balanceModes}
            optionValue="value"
            optionText="name"
            t={t}
          />

          <fieldset className="features">
            <legend><strong>{t('pageLoadBalancer.session')}</strong></legend>

            <div className="form-group">
              <label className="control-label" >{t('pageLoadBalancer.session')}</label>
              <div className="col-sm-10">
                <div>
                  <label className="radio inline">
                    <input
                      type="radio"
                      checked={session.value}
                      name="session"
                      onChange={() => {}}
                      onClick={() => {
                        session.onChange(true);
                        sessionPersistenceMode.onChange('SOURCE_IP');
                      }}
                    />
                    {t('pageLoadBalancer.on')}
                  </label>

                  <label className="radio inline">
                    <input
                      type="radio"
                      checked={!session.value}
                      name="session"
                      onChange={() => {}}
                      onClick={() => {
                        session.onChange(false);
                        sessionPersistenceMode.onChange(undefined);
                      }}
                    />
                    {t('pageLoadBalancer.off')}&nbsp;
                  </label>
                </div>
              </div>
            </div>

            {session.value &&
              <SelectInput
                item={sessionPersistenceMode}
                itemName="pageLoadBalancer.sessionPersistenceMode"
                optionList={this.sessionPersistenceModes}
                optionValue="value"
                t={t}
              />
            }
          </fieldset>

          <fieldset className="features">
            <legend><strong>{t('pageLoadBalancer.health')}</strong></legend>

            <SelectInput
              item={healthMonitorType}
              itemName="pageLoadBalancer.healthMonitorType"
              optionList={this.healthMonitorTypes}
              optionValue="value"
              t={t}
            />

            <NumberInput
              item={healthMonitorDelay}
              itemName="pageLoadBalancer.healthMonitorDelay"
              submitFailed={submitFailed}
              helpText={t('pageLoadBalancer.healthMonitorDelayRange')}
              t={t}
            />

            <NumberInput
              item={healthMonitorTimeout}
              itemName="pageLoadBalancer.healthMonitorTimeout"
              submitFailed={submitFailed}
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
          </fieldset>
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
  }
}

ListenerCreateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

ListenerCreateForm.validate = (values) => {
  const errors = {};
  errors.port = Validations.port(values.port);
  // errors.connectionLimit = Validations.connectionLimit(values.connectionLimit);
  errors.healthMonitorDelay = Validations.healthMonitorDelay(values.healthMonitorDelay);
  errors.healthMonitorTimeout = Validations.healthMonitorTimeout(values.healthMonitorTimeout);
  return errors;
};

export default reduxForm({
  form: 'ListenerCreateForm',
  fields: [
    'name',
    'description',
    'protocol',
    'port',
    'balanceMode',
    // 'connectionLimit',
    'session',
    'sessionPersistenceMode',
    'healthMonitorType',
    'healthMonitorDelay',
    'healthMonitorTimeout',
    'healthMonitorMaxRetries',
  ],
  validate: ListenerCreateForm.validate,
})(translate()(ListenerCreateForm));
