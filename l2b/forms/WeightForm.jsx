import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';import * as Validations from '../../shared/utils/validations';
import NumberInput from '../../shared/components/FormInputs/NumberInput';
import FooterButtons from '../../shared/components/FormInputs/FooterButtons';

let WeightForm = (props) => {
  const { fields:
    { weight },
    handleSubmit,
    submitting,
    submitFailed,
    resetForm,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">
        <NumberInput
          item={weight}
          itemName="weight"
          submitFailed={submitFailed}
          inputParams={{ min: '1', max: '256' }}
          helpText={t('pageLoadBalancer.weightRange')}
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

WeightForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

WeightForm.validate = values => {
  const errors = {};
  errors.weight = Validations.weight(values.weight);
  return errors;
};

WeightForm = reduxForm({
  form: 'WeightForm',
  fields: ['weight'],
  validate: WeightForm.validate,
})(translate()(WeightForm));

export default WeightForm;
