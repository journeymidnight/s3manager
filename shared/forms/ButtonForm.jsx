import React from 'react';
import { reduxForm } from 'redux-form';
import { translate } from 'react-i18next';

let ButtonForm = (props) => {
  const {
    handleSubmit,
    submitting,
    text,
    type,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className={`btn btn-danger ${type}`} disabled={submitting}>
        {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {text}
      </button>
    </form>
  );
};

ButtonForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
  text: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
};

ButtonForm = reduxForm({
  form: 'ButtonForm',
  fields: [],
})(translate()(ButtonForm));

export default ButtonForm;
