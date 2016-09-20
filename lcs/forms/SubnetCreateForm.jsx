import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { cidr },
    handleSubmit,
    submitting,
    submitFailed,
    t,
    invalid,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className={submitFailed && cidr.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('cidr')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...cidr} />
            {(submitFailed || cidr.touched) && cidr.error && <div className="text-danger"><small>{cidr.error}</small></div>}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
        <button type="submit" className="btn btn-save" disabled={submitting || invalid}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('create')}
        </button>
      </div>
    </form>
  );
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

F.validate = values => {
  const errors = {};
  errors.cidr = Validations.cidr(values.cidr);
  return errors;
};

export default reduxForm({
  form: 'SubnetCreateForm',
  fields: ['cidr'],
  validate: F.validate,
})(translate()(F));
