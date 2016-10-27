import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';
import i18n from '../../shared/i18n';

class ObjectCreateForm extends React.Component {

  componentDidMount() {
    const initialValues = {
      objectName: '',
      folderNames: this.props.folderNames,
    };
    this.props.initializeForm(initialValues);
  }

  render() {
    const { fields:
      { objectName },
      handleSubmit,
      submitting,
      submitFailed,
      resetForm,
      t,
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit} autoComplete="off">
        <div className="modal-body">
          <div className={(submitFailed || objectName.touched) && objectName.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('pageObjectCreate.folderName')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" {...objectName} />
              {objectName.error && <div className="text-danger"><small>{objectName.error}</small></div>}
              <p className="help-block">{t('pageObjectCreate.folderNameHint').split('\n').map((item) =>
                <span key={Math.random()}>{item}<br /></span>
              )}</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
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
  }
}

ObjectCreateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
  folderNames: React.PropTypes.array,
};

ObjectCreateForm.validate = values => {
  const errors = {};
  errors.objectName = Validations.required(values.objectName);
  if (!Validations.isEmpty(values.objectName) && !/^[0-9a-z\u4E00-\u9FA5]{1}([a-z0-9\u4E00-\u9FA5_]|[-]|[.]){0,253}$/i.test(values.objectName)) {
    errors.objectName = i18n.t('pageObjectCreate.objectNameNotValid');
  }
  if (!Validations.isEmpty(values.objectName) && values.folderNames.find(folderName => folderName === values.objectName)) {
    errors.objectName = i18n.t('pageObjectCreate.objectNameDuplicated');
  }

  return errors;
};

export default reduxForm({
  form: 'ObjectCreateForm',
  fields: ['objectName', 'folderNames'],
  validate: ObjectCreateForm.validate,
})(translate()(ObjectCreateForm));
