import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { projectName, description },
    handleSubmit,
    resetForm,
    submitting,
    submitFailed,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className={submitFailed && projectName.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('name')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...projectName} />
          {submitFailed && projectName.error && <div className="text-danger"><small>{projectName.error}</small></div>}
        </div>
      </div>
      <div className={submitFailed && description.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('description')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...description} />
          {submitFailed && description.error && <div className="text-danger"><small>{description.error}</small></div>}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-save pull-right" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
        </button>
      </div>
    </form>
  );
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

F.validate = values => {
  const errors = {};
  errors.projectName = Validations.required(values.projectName);
  return errors;
};

export default reduxForm({
  form: 'ProjectForm',
  fields: ['projectName', 'description'],
  validate: F.validate,
})(translate()(F));
