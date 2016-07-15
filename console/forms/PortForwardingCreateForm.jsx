import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

class F extends React.Component {

  componentDidMount() {
    const initialValues = {
      protocol: 'tcp',
    };

    this.props.initializeForm(initialValues);
  }

  render() {
    const { fields:
      { protocol, outsidePort, insideAddress, insidePort },
      handleSubmit,
      submitting,
      submitFailed,
      resetForm,
      t,
      invalid,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <div className={submitFailed && protocol.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formPortForwardingForm.protocol')}</label>
          <div className="col-sm-10">
            <select className="form-control" {...protocol}>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
            </select>
          </div>
        </div>

        <div className={submitFailed && outsidePort.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formPortForwardingForm.outsidePort')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...outsidePort} />
            {submitFailed && outsidePort.error && <div className="text-danger"><small>{outsidePort.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && insideAddress.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formPortForwardingForm.insideAddress')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...insideAddress} />
            {submitFailed && insideAddress.error && <div className="text-danger"><small>{insideAddress.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && insidePort.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formPortForwardingForm.insidePort')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...insidePort} />
            {submitFailed && insidePort.error && <div className="text-danger"><small>{insidePort.error}</small></div>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-save" disabled={submitting || invalid}>
            {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('create')}
          </button>
          &nbsp;
          <button type="button" className="btn btn-cancel" disabled={submitting} onClick={resetForm}>
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
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

F.validate = values => {
  const errors = {};
  errors.protocol = Validations.required(values.protocol);
  errors.outsidePort = Validations.required(values.outsidePort);
  errors.insideAddress = Validations.required(values.insideAddress);
  errors.insidePort = Validations.required(values.insidePort);
  return errors;
};

export default reduxForm({
  form: 'PortForwardingCreateForm',
  fields: ['protocol', 'outsidePort', 'insideAddress', 'insidePort'],
  validate: F.validate,
})(translate()(F));
