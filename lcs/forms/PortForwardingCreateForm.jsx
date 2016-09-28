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
      t,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className={(submitFailed || protocol.touched) && protocol.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('formPortForwardingForm.protocol')}</label>
            <div className="col-sm-10">
              <select className="form-control" {...protocol}>
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
              </select>
            </div>
          </div>

          <div className={(submitFailed || outsidePort.touched) && outsidePort.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('formPortForwardingForm.outsidePort')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" {...outsidePort} />
              {(submitFailed || outsidePort.touched) && outsidePort.error && <div className="text-danger"><small>{outsidePort.error}</small></div>}
            </div>
          </div>

          <div className={(submitFailed || insideAddress.touched) && insideAddress.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('formPortForwardingForm.insideAddress')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" {...insideAddress} />
              {(submitFailed || insideAddress.touched) && insideAddress.error && <div className="text-danger"><small>{insideAddress.error}</small></div>}
            </div>
          </div>

          <div className={(submitFailed || insidePort.touched) && insidePort.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('formPortForwardingForm.insidePort')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" {...insidePort} />
              {(submitFailed || insidePort.touched) && insidePort.error && <div className="text-danger"><small>{insidePort.error}</small></div>}
            </div>
          </div>
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

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

F.validate = values => {
  const errors = {};
  errors.protocol = Validations.required(values.protocol);
  errors.outsidePort = Validations.port(values.outsidePort);
  errors.insideAddress = Validations.ipAddress(values.insideAddress);
  errors.insidePort = Validations.port(values.insidePort);
  return errors;
};

export default reduxForm({
  form: 'PortForwardingCreateForm',
  fields: ['protocol', 'outsidePort', 'insideAddress', 'insidePort'],
  validate: F.validate,
})(translate()(F));
