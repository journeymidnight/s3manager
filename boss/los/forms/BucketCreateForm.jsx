import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../../shared/utils/validations';
import i18n from '../../../shared/i18n';
import TextInput from '../../../shared/components/FormInputs/TextInput';
import RadioInput from '../../../shared/components/FormInputs/RadioInput';
import FooterButtons from '../../../shared/components/FormInputs/FooterButtons';

class F extends React.Component {

  componentDidMount() {
    const initialValues = {
      bucketName: '',
      acl: 'private',
    };
    this.props.initializeForm(initialValues);
  }

  render() {
    const { fields:
      { bucketName, acl },
      handleSubmit,
      submitting,
      submitFailed,
      closeForm,
      t,
    } = this.props;

    const radioOptions = [
      { name: t('pageBucketCreate.aclPrivate'), value: 'private' },
      { name: t('pageBucketCreate.aclPublicR'), value: 'public-read' },
    ];

    return (
      <form className="form-horizontal" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-body">
          <TextInput
            item={bucketName}
            itemName="pageBucketCreate.bucketName"
            submitFailed={submitFailed}
            inputParams={{ maxLength: '250' }}
            helpText={t('pageBucketCreate.bucketNameHint')}
            t={t}
          />

          <RadioInput
            item={acl}
            itemName="pageBucketCreate.acl"
            optionList={radioOptions}
            optionValue="private"
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
  }
}

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  closeForm: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

F.validate = values => {
  const errors = {};
  errors.bucketName = Validations.required(values.bucketName);
  if (!Validations.isEmpty(values.bucketName) && (!/^[0-9a-z]{1}([a-z0-9]|[-]){1,61}[0-9a-z]{1}$/.test(values.bucketName) || values.bucketName === 'admin')) {
    errors.bucketName = i18n.t('pageBucketCreate.bucketNameNotValid');
  }

  return errors;
};

export default reduxForm({
  form: 'BucketCreateForm',
  fields: ['bucketName', 'acl'],
  validate: F.validate,
})(translate()(F));
