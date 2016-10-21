import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

class SessionForm extends React.Component {

  constructor() {
    super();

    this.sessionPersistenceModes = ['SOURCE_IP', 'HTTP_COOKIE', 'APP_COOKIE'];
  }

  render() {
    const { fields:
      {
        session,
        sessionPersistenceMode,
        sessionPersistenceTimeout,
      },
      handleSubmit,
      submitting,
      submitFailed,
      t,
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-body">
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
                      sessionPersistenceTimeout.onChange(undefined);
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

          {session.value && <div className={(submitFailed || sessionPersistenceTimeout.touched) && sessionPersistenceTimeout.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('pageLoadBalancer.sessionPersistenceTimeout')}</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" min="1" placeholder={t('pageLoadBalancer.sessionPersistenceTimeoutRange')} {...sessionPersistenceTimeout} />
              {(submitFailed || sessionPersistenceTimeout.touched) && sessionPersistenceTimeout.error &&
                <div className="text-danger"><small>{sessionPersistenceTimeout.error}</small></div>
              }
            </div>
          </div>}
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

SessionForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

SessionForm.validate = values => {
  const errors = {};
  if (values.session) {
    errors.sessionPersistenceTimeout = Validations.integer(values.sessionPersistenceTimeout);
  }
  return errors;
};

export default reduxForm({
  form: 'SessionForm',
  fields: [
    'session',
    'sessionPersistenceMode',
    'sessionPersistenceTimeout',
  ],
  validate: SessionForm.validate,
})(translate()(SessionForm));
