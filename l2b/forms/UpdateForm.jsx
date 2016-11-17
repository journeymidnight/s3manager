import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import TextInput from '../../shared/components/FormInputs/TextInput';
import FooterButtons from '../../shared/components/FormInputs/FooterButtons';

let UpdateForm = (props) => {
  const { fields:
    { name, description },
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

UpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

UpdateForm.validate = () => {
  const errors = {};
  return errors;
};

UpdateForm = reduxForm({
  form: 'UpdateForm',
  fields: ['name', 'description'],
  validate: UpdateForm.validate,
})(translate()(UpdateForm));

export default UpdateForm;
