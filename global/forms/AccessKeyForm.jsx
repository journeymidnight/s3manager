import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';

const F = (props) => {
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

      <div className={(submitFailed || name.touched) && name.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('name')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...name} />
          {(submitFailed || name.touched) && name.error && <div className="text-danger"><small>{name.error}</small></div>}
        </div>
      </div>

      <div className={(submitFailed || description.touched) && description.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('description')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...description} />
          {(submitFailed || description.touched) && description.error && <div className="text-danger"><small>{description.error}</small></div>}
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

F.validate = () => {
  const errors = {};
  return errors;
};

export default reduxForm({
  form: 'AccessKeyForm',
  fields: ['name', 'description'],
  validate: F.validate,
})(translate()(F));
