import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';
import SliderInput from '../../shared/components/FormInputs/SliderInput';
import FooterButtons from '../../shared/components/FormInputs/FooterButtons';

let BandwidthForm = (props) => {
  const { fields:
    { bandwidth },
    handleSubmit,
    submitting,
    resetForm,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">
        <SliderInput
          item={bandwidth}
          itemName="bandwidth"
          max={300}
          min={1}
          step={1}
          unit="Mbps"
          t={t}
        />
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
};

BandwidthForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
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
