import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';import * as Validations from '../../shared/utils/validations';
import Slider from '../../shared/components/Slider';

let BandwidthForm = (props) => {
  const { fields:
    { bandwidth },
    handleSubmit,
    submitting,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="form-group">
          <label className="control-label" >{t('bandwidth')}</label>
          <div className="col-sm-10">
            <input type="hidden" className="form-control" value={bandwidth.value} disabled="disabled" />
            <Slider min={1} max={300} step={1} value={bandwidth.value} unit={'Mbps'} onChange={param => bandwidth.onChange(param)} />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
        </button>
      </div>
    </form>
  );
};

BandwidthForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

BandwidthForm.validate = values => {
  const errors = {};
  errors.bandwidth = Validations.integer(values.bandwidth);
  return errors;
};

BandwidthForm = reduxForm({
  form: 'BandwidthForm',
  fields: ['bandwidth'],
  validate: BandwidthForm.validate,
})(translate()(BandwidthForm));

export default BandwidthForm;
