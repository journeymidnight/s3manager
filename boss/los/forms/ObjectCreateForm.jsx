import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../../shared/utils/validations';
import i18n from '../../../shared/i18n';
import TextInput from '../../../shared/components/FormInputs/TextInput';
import FooterButtons from '../../../shared/components/FormInputs/FooterButtons';

class ObjectCreateForm extends React.Component {

  componentDidMount() {
    const initialValues = {
      objectName: '',
    };
    this.props.initializeForm(initialValues);
  }

  render() {
    const { fields:
      { objectName },
      handleSubmit,
      submitting,
      submitFailed,
      closeForm,
      t,
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-body">
          <TextInput
            item={objectName}
            itemName="pageObjectCreate.folderName"
            submitFailed={submitFailed}
            helpText={t('pageObjectCreate.folderNameHint')}
            t={t}
          />
        </div>

        <div className="form-footer">
          <FooterButtons
            closeForm={closeForm}
            submitting={submitting}
            t={t}
          />
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
  closeForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
  folderNames: React.PropTypes.array,
  folderLocation: React.PropTypes.string,
};

ObjectCreateForm.validate = (values, props) => {
  const errors = {};
  errors.objectName = Validations.required(values.objectName);
  if (!Validations.isEmpty(values.objectName) && !/^[0-9a-z\u4E00-\u9FA5]{1}([a-z0-9\u4E00-\u9FA5_]|[-]|[.]){0,253}$/i.test(values.objectName)) {
    errors.objectName = i18n.t('pageObjectCreate.objectNameNotValid');
  }
  if (!Validations.isEmpty(values.objectName) && props.folderNames.find(folderName => folderName === props.folderLocation + values.objectName)) {
    errors.objectName = i18n.t('pageObjectCreate.objectNameDuplicated');
  }

  return errors;
};

export default reduxForm({
  form: 'ObjectCreateForm',
  fields: ['objectName'],
  validate: ObjectCreateForm.validate,
})(translate()(ObjectCreateForm));
