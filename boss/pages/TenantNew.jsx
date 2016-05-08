import React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { name, description },
    error,
    handleSubmit,
    submitting,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit(F.submit)}>
      <div className="flash-container">
        {error && <div className="flash-alert">{error}</div>}
      </div>
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

F.submit = (values, dispatch) => {
  return new Promise((resolve, reject) => {
    const name = values.name;
    const description = values.description;

    dispatch(Actions.requestCreateTenant({
      name,
      description,
    }))
    .then(() => {
      resolve();
    }).catch((error) => {
      reject({ _error: error.message });
    });
  });
};

F.validate = values => {
  const errors = {};
  errors.name = Validations.required(values.name);
  errors.description = Validations.required(values.description);
  return errors;
};

const Form = reduxForm({
  form: 'createTenant',
  fields: ['name', 'description'],
  validate: F.validate,
})(F);

const C = () => {
  return (
    <div className="container-fluid container-limited">
      <div className="content">
        <div className="clearfix">
          <h3 className="page-title">
            添加租户
          </h3>
          <hr />
          <Form />
        </div>
      </div>
    </div>
  );
};

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  context: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    context: state.context,
  };
}

export default connect(mapStateToProps)(C);
