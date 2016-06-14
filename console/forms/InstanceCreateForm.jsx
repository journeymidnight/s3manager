import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { name, imageId, instanceTypeId, subnetId, count },
    handleSubmit,
    submitting,
    submitFailed,
    resetForm,
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
              return (
                <option key={instanceType.instanceTypeId} value={instanceType.instanceTypeId}>
                  {instanceType.vcpus} CPU {instanceType.memory}MB 内存
                </option>
              );
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

      <div className={submitFailed && count.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('formInstanceCreateForm.count')}</label>
        <div className="col-sm-10">
          <input type="number" className="form-control" {...count} />
          {submitFailed && count.error && <div className="text-danger"><small>{count.error}</small></div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
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
  imageSet: React.PropTypes.array,
  instanceTypeSet: React.PropTypes.array,
  subnetSet: React.PropTypes.array,
};

F.validate = values => {
  const errors = {};
  errors.imageId = Validations.required(values.imageId);
  errors.instanceTypeId = Validations.required(values.instanceTypeId);
  errors.subnetId = Validations.required(values.subnetId);
  errors.count = Validations.required(values.count);
  return errors;
};

export default reduxForm({
  form: 'InstanceCreateForm',
  fields: ['name', 'imageId', 'instanceTypeId', 'subnetId', 'count'],
  validate: F.validate,
})(translate()(F));
