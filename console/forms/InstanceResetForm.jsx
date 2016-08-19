import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import * as Validations from '../../shared/utils/validations';
import i18n from '../../shared/i18n';

class InstanceResetForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = { initialized: false };
  }

  componentDidMount() {
    const { region } = this.props;

    const initialValues = {};
    if (this.props.instance.keyPairId) {
      initialValues.loginMode = 'keyPair';
      initialValues.keyPairId = this.props.instance.keyPairId;
    } else {
      initialValues.loginMode = 'password';
    }

    this.props.initializeForm(initialValues);

    IaaS
    .doAction(region.regionId, ACTION_NAMES.describeKeyPairs, {
      status: ['active'],
      limit: 100,
    })
    .promise
    .then((payload) => {
      this.keyPairSet = payload.keyPairSet;
      this.setState({ initialized: true });
    });
  }

  render() {
    if (!this.state.initialized) {
      return <div />;
    }

    const { fields:
      { loginMode, keyPairId, loginPassword },
      handleSubmit,
      submitting,
      submitFailed,
      t,
      invalid,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-body">

          <div className="form-group">
            <label className="control-label" >{t('pageInstanceCreate.loginMode')}</label>
            <div className="col-sm-10">
              <div>
                <label className="radio inline">
                  <input type="radio" checked={loginMode.value === 'password'} name="input_login_mode" onChange={() => {}} onClick={() => { loginMode.onChange('password'); }} />
                  {t('pageInstanceCreate.loginPassword')}
                </label>
                <label className="radio inline">
                  <input type="radio" checked={loginMode.value === 'keyPair'} name="input_login_mode" onChange={() => {}} onClick={() => { loginMode.onChange('keyPair'); }} />
                  {t('pageInstanceCreate.keyPair')}&nbsp;
                </label>
              </div>
            </div>
          </div>

          {loginMode.value === 'keyPair' && <div className="form-group">
            <label className="control-label" >{t('pageInstanceCreate.keyPair')}</label>
            <div className="col-sm-10">
              <select className="form-control" {...keyPairId}>
                {this.keyPairSet && this.keyPairSet.map((keyPair) => {
                  return (
                    <option key={keyPair.keyPairId} value={keyPair.keyPairId}>
                      {keyPair.name} ({keyPair.keyPairId})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>}

          {loginMode.value === 'password' && <div className={submitFailed && loginPassword.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('pageInstanceCreate.loginPassword')}</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" {...loginPassword} />
              {submitFailed && loginPassword.error && <div className="text-danger"><small>{loginPassword.error}</small></div>}
              <p className="help-block">{t('pageInstanceCreate.passwordHint')}</p>
            </div>
          </div>}

        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
          <button type="submit" className="btn btn-save" disabled={submitting || invalid}>
            {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
          </button>
        </div>
      </form>
    );
  }
}

InstanceResetForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  instance: React.PropTypes.object.isRequired,
  region: React.PropTypes.object.isRequired,
  t: React.PropTypes.any,
};

InstanceResetForm.validate = values => {
  const errors = {};
  if (values.loginMode === 'password') {
    if (Validations.isEmpty(values.loginPassword) || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/i.test(values.loginPassword)) {
      errors.loginPassword = i18n.t('pageInstanceCreate.passwordNotValid');
    }
  }
  return errors;
};

InstanceResetForm = reduxForm({
  form: 'InstanceResetForm',
  fields: ['loginMode', 'loginPassword', 'keyPairId'],
  validate: InstanceResetForm.validate,
})(translate()(InstanceResetForm));

export default InstanceResetForm;
