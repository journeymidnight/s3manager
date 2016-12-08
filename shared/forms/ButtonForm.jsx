import React from 'react';
import { reduxForm } from 'redux-form';
import { translate } from 'react-i18next';

const F = (props) => {
  const {
    handleSubmit,
    submitting,
    text,
    type,
    disabled,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className={`btn ${type}`} disabled={disabled || submitting}>
        {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {text}
      </button>
    </form>
  );
};

F.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
  text: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  disabled: React.PropTypes.bool,
};

const ButtonForm = reduxForm({
  form: 'ButtonForm',
  fields: [],
})(translate()(F));

export default ButtonForm;

export function buttonForm(props) {
  const formName = Math.random().toString(36).slice(2);
  const Form = reduxForm({
    form: formName,
    fields: [],
  })(translate()(F));
  return <Form {...props} />;
}
