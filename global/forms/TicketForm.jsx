import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { title, content },
    handleSubmit,
    submitting,
    submitFailed,
    resetForm,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>

      <div className={(submitFailed || title.touched) && title.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('pageTicketCreate.title')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...title} />
          {(submitFailed || title.touched) && title.error && <div className="text-danger"><small>{title.error}</small></div>}
        </div>
      </div>

      <div className={(submitFailed || content.touched) && content.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('pageTicketCreate.content')}</label>
        <div className="col-sm-10">
          <textarea rows="10" className="form-control" {...content} />
          {(submitFailed || content.touched) && content.error && <div className="text-danger"><small>{content.error}</small></div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('create')}
        </button>
        &nbsp;
        <button type="button" className="btn btn-cancel" disabled={submitting} onClick={resetForm}>
          {t('reset')}
        </button>
      </div>
    </form>
  );
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

F.validate = (values) => {
  const errors = {};
  errors.title = Validations.required(values.title);
  errors.content = Validations.required(values.content);
  return errors;
};

export default reduxForm({
  form: 'TicketForm',
  fields: ['title', 'content'],
  validate: F.validate,
})(translate()(F));
