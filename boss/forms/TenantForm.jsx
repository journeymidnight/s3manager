import React from 'react';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { name, description },
    handleSubmit,
    submitting,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className={name.touched && name.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >名称</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" placeholder="输入名称" {...name} />
          {name.touched && name.error && <div className="text-danger"><small>{name.error}</small></div>}
        </div>
      </div>
      <div className={description.touched && description.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >描述</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" placeholder="输入描述" {...description} />
          {description.touched && description.error && <div className="text-danger"><small>{description.error}</small></div>}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} 保存
        </button>
        &nbsp;
        <a className="btn btn-cancel" href="/tenants">
          取消
        </a>
      </div>
    </form>
  );
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
};

F.validate = values => {
  const errors = {};
  errors.name = Validations.required(values.name);
  errors.description = Validations.required(values.description);
  return errors;
};

export default reduxForm({
  form: 'Tenant',
  fields: ['name', 'description'],
  validate: F.validate,
})(F);
