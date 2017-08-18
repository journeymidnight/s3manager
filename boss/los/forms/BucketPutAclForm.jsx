import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import SelectInput from '../../../shared/components/FormInputs/SelectInput';
import FooterButtons from '../../../shared/components/FormInputs/FooterButtons';

class BucketPutAclForm extends React.Component {

  componentDidMount() {
    const initialValues = { acl: 'private' };
    this.props.initializeForm(initialValues);
  }

  render() {
    const { fields:
        { acl },
        handleSubmit,
        closeForm,
        submitting,
        t,
    } = this.props;

    const selectOptions = [
      {
        value: 'private',
        name: t('pageBucketCreate.aclPrivate'),
      },
      {
        value: 'public-read',
        name: t('pageBucketCreate.aclPublicR'),
      },
    ];

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-body">
          <SelectInput
            item={acl}
            itemName="pageBucketCreate.acl"
            optionList={selectOptions}
            optionValue={acl.initialValue}
            t={t}
          />
        </div>
        <div className="form-footer">
          <FooterButtons
            handleSubmit={handleSubmit}
            closeForm={closeForm}
            submitting={submitting}
            t={t}
          />
        </div>
      </form>
    );
  }
}

BucketPutAclForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  closeForm: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

export default reduxForm({
  form: 'BucketPutAclForm',
  fields: ['acl'],
})(translate()(BucketPutAclForm));
