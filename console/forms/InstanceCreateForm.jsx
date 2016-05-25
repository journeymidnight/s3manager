import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { name, imageId, instanceTypeId, subnetId },
    handleSubmit,
    submitting,
    submitFailed,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>

      <div className={submitFailed && name.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('name')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...name} />
          {submitFailed && name.error && <div className="text-danger"><small>{name.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && imageId.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('image')}</label>
        <div className="col-sm-10">
          <select className="form-control" {...imageId}>
            {props.imageSet.map((image) => {
              return <option key={image.imageId} value={image.imageId}>{image.name}</option>;
            })}
          </select>
          {submitFailed && imageId.error && <div className="text-danger"><small>{imageId.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && instanceTypeId.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('instanceType')}</label>
        <div className="col-sm-10">
          <select className="form-control" {...instanceTypeId}>
            {props.instanceTypeSet.map((instanceType) => {
              return <option key={instanceType.instanceTypeId} value={instanceType.instanceTypeId}>{instanceType.instanceTypeId}</option>;
            })}
          </select>
          {submitFailed && instanceTypeId.error && <div className="text-danger"><small>{instanceTypeId.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && subnetId.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('network')}</label>
        <div className="col-sm-10">
          <select className="form-control" {...subnetId}>
            {props.subnetSet.map((subnet) => {
              return <option key={subnet.subnetId} value={subnet.subnetId}>{subnet.name} ({subnet.cidr})</option>;
            })}
          </select>
          {submitFailed && subnetId.error && <div className="text-danger"><small>{subnetId.error}</small></div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
        </button>
        &nbsp;
        <Link className="btn btn-cancel" to="/regions">
          {t('cancel')}
        </Link>
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
  t: React.PropTypes.any,
  imageSet: React.PropTypes.array,
  instanceTypeSet: React.PropTypes.array,
  subnetSet: React.PropTypes.array,
};

F.validate = values => {
  const errors = {};
  errors.name = Validations.required(values.name);
  errors.imageId = Validations.required(values.imageId);
  errors.instanceTypeId = Validations.required(values.instanceTypeId);
  errors.subnetId = Validations.required(values.subnetId);
  return errors;
};

export default reduxForm({
  form: 'KeyPairForm',
  fields: ['name', 'imageId', 'instanceTypeId', 'subnetId'],
  validate: F.validate,
})(translate()(F));
