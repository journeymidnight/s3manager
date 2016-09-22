import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

class BandwidthUpdateForm extends React.Component {

  componentDidMount() {
    this.props.initializeForm({ name: this.props.resourceName, bandwidth: this.props.originalBandwidth });
  }

  render() {
    const { fields:
      { name, bandwidth },
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
              <input type="text" className="form-control" disabled {...name} />
              {(submitFailed || name.touched) && name.error && <div className="text-danger"><small>{name.error}</small></div>}
            </div>
          </div>
          <div className={(submitFailed || bandwidth.touched) && bandwidth.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('bandwidth')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" {...bandwidth} />
              {(submitFailed || bandwidth.touched) && bandwidth.error && <div className="text-danger"><small>{bandwidth.error}</small></div>}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
          <button type="submit" className="btn btn-save" disabled={submitting}>
            {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('submit')}
          </button>
        </div>
      </form>
    );
  }
}


BandwidthUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  resourceName: React.PropTypes.string.isRequired,
  originalBandwidth: React.PropTypes.number.isRequired,
  t: React.PropTypes.any,
};

BandwidthUpdateForm.validate = (values) => {
  const errors = {};
  errors.bandwidth = Validations.integer(values.bandwidth);
  return errors;
};

BandwidthUpdateForm = reduxForm({
  form: 'BandwidthUpdateForm',
  fields: ['name', 'bandwidth'],
  validate: BandwidthUpdateForm.validate,
})(translate()(BandwidthUpdateForm));

export default BandwidthUpdateForm;
