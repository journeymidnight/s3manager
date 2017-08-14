import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import TextInput from '../../shared/components/FormInputs/TextInput';
import FooterButtons from '../../shared/components/FormInputs/FooterButtons';

const F = (props) => {
  const { fields:
    { name, description },
    handleSubmit,
    submitting,
    submitFailed,
    closeForm,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit} autoComplete="off">
      <div className="form-body">
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
      <div className="form-footer">
        <FooterButtons
          handleSubmit={handleSubmit}
          submitting={submitting}
          closeForm={closeForm}
          t={t}
        />
      </div>
    </form >
  );
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  closeForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

F.validate = () => {
  const errors = {};
  return errors;
};

export default reduxForm({
  form: 'AccessKeyForm',
  fields: ['name', 'description'],
  validate: F.validate,
})(translate()(F));