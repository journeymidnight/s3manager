import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';import * as Validations from '../../shared/utils/validations';

let WeightForm = (props) => {
  const { fields:
    { weight },
    handleSubmit,
    submitting,
    submitFailed,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">

        <div className={(submitFailed || weight.touched) && weight.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('weight')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...weight} />
            {(submitFailed || weight.touched) && weight.error && <div className="text-danger"><small>{weight.error}</small></div>}
            <p className="help-block">{t('pageLoadBalancer.weightRange')}</p>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
        <button type="submit" className="btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
        </button>
      </div>
    </form>
  );
};

WeightForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

WeightForm.validate = values => {
  const errors = {};
  errors.weight = Validations.weight(values.weight);
  return errors;
};

WeightForm = reduxForm({
  form: 'WeightForm',
  fields: ['weight'],
  validate: WeightForm.validate,
})(translate()(WeightForm));

export default WeightForm;
