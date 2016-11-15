import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Slider from '../../shared/components/Slider';
import * as Validations from '../../shared/utils/validations';

class ListenerCreateForm extends React.Component {

  constructor() {
    super();

    this.protocols = ['TCP'];
    this.balanceModes = [
      { name: 'roundRobin', value: 'ROUND_ROBIN' },
      { name: 'weightedRoundRobin', value: 'WEIGHTED_ROUND_ROBIN' },
      { name: 'sourceIp', value: 'SOURCE_IP' },
    ];
    this.sessionPersistenceModes = ['SOURCE_IP'];
    this.healthMonitorTypes = ['TCP'];
  }

  componentDidMount() {
    const initialValues = {
      protocol: 'TCP',
      balanceMode: 'ROUND_ROBIN',
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
      t,
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className={(submitFailed || name.touched) && name.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('name')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" {...name} maxLength="50" />
              {(submitFailed || name.touched) && name.error && <div className="text-danger"><small>{name.error}</small></div>}
            </div>
          </div>

          <div className={(submitFailed || description.touched) && description.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('description')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" {...description} maxLength="250" />
              {(submitFailed || description.touched) && description.error && <div className="text-danger"><small>{description.error}</small></div>}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label" >{t('protocol')}</label>
            <div className="col-sm-10">
              <select className="form-control" {...protocol}>
                {this.protocols.map((item) =>
                  <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>

          <div className={(submitFailed || port.touched) && port.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('port')}</label>
            <div className="col-sm-10">
              <input type="number" min="1" max="65535" className="form-control" {...port} />
              {(submitFailed || port.touched) && port.error && <div className="text-danger"><small>{port.error}</small></div>}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label" >{t('pageLoadBalancer.balanceMode')}</label>
            <div className="col-sm-10">
              <select className="form-control" {...balanceMode}>
                {this.balanceModes.map((item) =>
                  <option key={item.name} value={item.value}>{t(`pageLoadBalancer.${item.name}`)}</option>)}
              </select>
            </div>
          </div>

          {/* <div className={(submitFailed || connectionLimit.touched) && connectionLimit.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('pageLoadBalancer.connectionLimit')}</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" min="-1" placeholder={t('pageLoadBalancer.connectionLimitRange')} {...connectionLimit} />
              {(submitFailed || connectionLimit.touched) && connectionLimit.error &&
                <div className="text-danger"><small>{connectionLimit.error}</small></div>
              }
            </div>
          </div>*/}

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

            {session.value && <div className="form-group">
              <label className="control-label" >{t('pageLoadBalancer.sessionPersistenceMode')}</label>
              <div className="col-sm-10">
                <select className="form-control" {...sessionPersistenceMode}>
                  {this.sessionPersistenceModes.map((mode) =>
                    <option key={mode} value={mode}>{mode}</option>)}
                </select>
              </div>
            </div>}
          </fieldset>

          <fieldset className="features">
            <legend><strong>{t('pageLoadBalancer.health')}</strong></legend>

            <div className="form-group">
              <label className="control-label" >{t('pageLoadBalancer.healthMonitorType')}</label>
              <div className="col-sm-10">
                <select className="form-control" {...healthMonitorType}>
                  {this.healthMonitorTypes.map((type) =>
                    <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

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
                <p className="help-block">{t('pageLoadBalancer.healthMonitorMaxRetriesHint')}</p>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
          <button type="submit" className="btn btn-save" disabled={submitting}>
            {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('create')}
          </button>
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
  t: React.PropTypes.any,
};

ListenerCreateForm.validate = (values, props) => {
  console.log(props)
  const errors = {};
  errors.port = Validations.port(values.port);
  if (props.ports.includes(values.port)) {
    errors.port = props.t('validationMessage.port');
  }
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
