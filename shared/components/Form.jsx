import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';

export const Input = (props) => {
  const { submitFailed } = props.form;
  const field = props.field;
  const label = props.label;

  return (
    <div className={submitFailed && field.error ? 'form-group has-error' : 'form-group'}>
      <label className="control-label" >{label}</label>
      <div className="col-sm-10">
        <input
          type="text"
          className="form-control"
          value={field.value}
          onBlur={field.onBlur}
          onChange={field.onChange}
          onDragStart={field.onDragStart}
          onDrop={field.onDrop}
          onFocus={field.onFocus}
        />
        {submitFailed && field.error && <div className="text-danger"><small>{field.error}</small></div>}
      </div>
    </div>
  );
};

Input.propTypes = {
  field: React.PropTypes.object.isRequired,
  form: React.PropTypes.object.isRequired,
  label: React.PropTypes.string.isRequired,
};

export const TextArea = (props) => {
  const { submitFailed } = props.form;
  const field = props.field;
  const label = props.label;
  const hint = props.hint;

  return (
    <div className={submitFailed && field.error ? 'form-group has-error' : 'form-group'}>
      <label className="control-label" >{label}</label>
      <div className="col-sm-10">
        <textarea
          rows="10"
          className="form-control"
          value={field.value}
          onBlur={field.onBlur}
          onChange={field.onChange}
          onDragStart={field.onDragStart}
          onDrop={field.onDrop}
          onFocus={field.onFocus}
        />
        {submitFailed && field.error && <div className="text-danger"><small>{field.error}</small></div>}
        {!!hint && <p className="help-block">{hint}</p>}
      </div>
    </div>
  );
};

TextArea.propTypes = {
  field: React.PropTypes.object.isRequired,
  form: React.PropTypes.object.isRequired,
  label: React.PropTypes.string.isRequired,
  hint: React.PropTypes.string,
};

export const Action = (props) => {
  const { submitting, resetForm, t } = props.form;

  return (
    <div className="form-actions">
      <button type="submit" className="btn btn-save" disabled={submitting}>
        {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {props.submitLabel}
      </button>
      &nbsp;
      <button type="button" className="btn btn-cancel" disabled={submitting} onClick={resetForm}>
        {t('reset')}
      </button>
    </div>
  );
};

Action.propTypes = {
  form: React.PropTypes.object.isRequired,
  submitLabel: React.PropTypes.string.isRequired,
};

class Form extends React.Component {

  validate() {
    return {};
  }

  render() {
    const { handleSubmit } = this.props.fields;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit} />
    );
  }
}

Form.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

export function attach(form) {
  const id = Math.random().toString(36).slice(2);
  return reduxForm({
    form: form.name || id,
    fields: form.fields,
    validate: form.validate,
  })(translate()(form));
}

export default Form;
