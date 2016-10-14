import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const BackendCreateForm = (props) => {
  const { fields:
    { name, description, address, port, weight },
    handleSubmit,
    submitting,
    submitFailed,
    t,
  } = props;
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
            <input type="text" className="form-control" {...description} />
            {(submitFailed || description.touched) && description.error && <div className="text-danger"><small>{description.error}</small></div>}
          </div>
        </div>

        <div className={(submitFailed || address.touched) && address.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('address')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...address} />
            {(submitFailed || address.touched) && address.error && <div className="text-danger"><small>{address.error}</small></div>}
          </div>
        </div>

        <div className={(submitFailed || port.touched) && port.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('port')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...port} />
            {(submitFailed || port.touched) && port.error && <div className="text-danger"><small>{port.error}</small></div>}
          </div>
        </div>

        <div className={(submitFailed || weight.touched) && weight.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('weight')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...weight} />
            {(submitFailed || weight.touched) && weight.error && <div className="text-danger"><small>{weight.error}</small></div>}
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
};

BackendCreateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

BackendCreateForm.validate = values => {
  const errors = {};
  errors.name = Validations.maxLength(50)(values.name);
  errors.description = Validations.maxLengthNotRequired(250)(values.description);
  errors.address = Validations.ipAddress(values.address);
  errors.port = Validations.port(values.port);
  errors.weight = Validations.weight(values.weight);
  return errors;
};

export default reduxForm({
  form: 'ListenerCreateForm',
  fields: ['name', 'description', 'address', 'port', 'weight'],
  validate: BackendCreateForm.validate,
})(translate()(BackendCreateForm));
