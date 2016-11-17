import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import SelectInput from '../../shared/components/FormInputs/SelectInput';
import FooterButtons from '../../shared/components/FormInputs/FooterButtons';

class SessionForm extends React.Component {

  constructor() {
    super();

    this.sessionPersistenceModes = [{ value: 'SOURCE_IP' }];
  }

  render() {
    const { fields:
      {
        session,
        sessionPersistenceMode,
      },
      handleSubmit,
      submitting,
      resetForm,
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
              optionValue="mode"
              t={t}
            />
          }
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

SessionForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

SessionForm.validate = () => {
  const errors = {};
  return errors;
};

export default reduxForm({
  form: 'SessionForm',
  fields: [
    'session',
    'sessionPersistenceMode',
  ],
  validate: SessionForm.validate,
})(translate()(SessionForm));
