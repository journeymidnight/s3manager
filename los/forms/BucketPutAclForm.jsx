import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';

class BucketPutAclForm extends React.Component {

  componentDidMount() {
    const initialValues = { acl: 'private' };
    this.props.initializeForm(initialValues);
  }

  render() {
    const { fields:
      { acl },
      handleSubmit,
      submitting,
      t,
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-body">

          <div className="form-group">
            <label className="control-label" >{t('pageBucket.bucketAcl')}</label>
            <div className="col-sm-10">
              <select className="form-control" onChange={acl.onChange}>
                <option key="private" value="private">
                  {t('pageBucketCreate.aclPrivate')}
                </option>

                <option key="public-read" value="public-read">
                  {t('pageBucketCreate.aclPublicR')}
                </option>

                <option key="public-read-write" value="public-read-write">
                  {t('pageBucketCreate.aclPublicRW')}
                </option>

              </select>
            </div>
          </div>

        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
          <button type="submit" className="btn btn-save" disabled={submitting}>
            {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('submit')}
          </button>
        </div>
      </form>
    );
  }
}

BucketPutAclForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

export default reduxForm({
  form: 'BucketPutAclForm',
  fields: ['acl'],
})(translate()(BucketPutAclForm));
