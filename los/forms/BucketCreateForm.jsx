import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';
import i18n from '../../shared/i18n';

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
      resetForm,
      t,
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label className="control-label" >{t('pageBucketCreate.bucketName')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...bucketName} />
            {submitFailed && bucketName.error && <div className="text-danger"><small>{bucketName.error}</small></div>}
            <p className="help-block">{t('pageBucketCreate.bucketNameHint').split('\n').map((item) =>
              <span>{item}<br /></span>
            )}</p>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label" >{t('pageBucketCreate.acl')}</label>
          <div className="col-sm-10">
            <label className="radio inline">
              <input type="radio" value="private" onChange={() => {}} onClick={() => { acl.onChange('private'); }} checked={acl.value === 'private'} />
              {t('pageBucketCreate.aclPrivate')}
            </label>

            <label className="radio inline">
              <input type="radio" value="public-read" onChange={() => {}} onClick={() => { acl.onChange('public-read'); }} checked={acl.value === 'public-read'} />
              {t('pageBucketCreate.aclPublicR')}
            </label>

            <label className="radio inline">
              <input
                type="radio"
                value="public-read-write"
                onChange={() => {}}
                onClick={() => { acl.onChange('public-read-write'); }}
                checked={acl.value === 'public-read-write'}
              />
              {t('pageBucketCreate.aclPublicRW')}
            </label>
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
  }
}

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
  publicImageSet: React.PropTypes.array,
  privateImageSet: React.PropTypes.array,
  instanceTypeSet: React.PropTypes.array,
  networkSet: React.PropTypes.array,
  keyPairSet: React.PropTypes.array,
  service: React.PropTypes.object,
};

F.validate = values => {
  const errors = {};
  errors.bucketName = Validations.required(values.bucketName);
  if (Validations.isEmpty(values.bucketName) || !/^[0-9a-z]{1}([a-z0-9]|[-]){1,61}[0-9a-z]{1}$/i.test(values.bucketName)) {
    errors.bucketName = i18n.t('pageBucketCreate.bucketNameNotValid');
  }

  return errors;
};

export default reduxForm({
  form: 'BucketCreateForm',
  fields: ['bucketName', 'acl'],
  validate: F.validate,
})(translate()(F));
