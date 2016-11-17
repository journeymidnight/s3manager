import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import TextInput from '../../shared/components/FormInputs/TextInput';
import NumberInput from '../../shared/components/FormInputs/NumberInput';
import FooterButtons from '../../shared/components/FormInputs/FooterButtons';
import * as Validations from '../../shared/utils/validations';

const BackendCreateForm = (props) => {
  const { fields:
    { name, description, address, port, weight },
    handleSubmit,
    submitting,
    submitFailed,
    resetForm,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">
        <TextInput
          item={name}
          itemName="name"
          submitFailed={submitFailed}
          inputParams={{ maxLength: '50' }}
          t={t}
        />

        <TextInput
          item={description}
          itemName="description"
          submitFailed={submitFailed}
          inputParams={{ maxLength: '250' }}
          t={t}
        />

        <TextInput
          item={address}
          itemName="address"
          submitFailed={submitFailed}
          t={t}
        />

        <NumberInput
          item={port}
          itemName="port"
          submitFailed={submitFailed}
          inputParams={{ min: '1', max: '65535' }}
          t={t}
        />

        <NumberInput
          item={weight}
          itemName="weight"
          submitFailed={submitFailed}
          inputParams={{ min: '1', max: '256', placeholder: t('pageLoadBalancer.weightRange') }}
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

BackendCreateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

BackendCreateForm.validate = values => {
  const errors = {};
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
