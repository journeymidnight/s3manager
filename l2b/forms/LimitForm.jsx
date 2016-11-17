import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';
import NumberInput from '../../shared/components/FormInputs/NumberInput';
import FooterButtons from '../../shared/components/FormInputs/FooterButtons';

const LimitForm = (props) => {
  const { fields:
    {
      connectionLimit,
    },
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
          item={connectionLimit}
          itemName="pageLoadBalancer.connectionLimit"
          submitFailed={submitFailed}
          inputParams={{ min: "-1",placeHolder: t('pageLoadBalancer.connectionLimitRange') }}
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

LimitForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

LimitForm.validate = values => {
  const errors = {};
  errors.connectionLimit = Validations.connectionLimit(values.connectionLimit);
  return errors;
};

export default reduxForm({
  form: 'LimitForm',
  fields: [
    'connectionLimit',
  ],
  validate: LimitForm.validate,
})(translate()(LimitForm));
