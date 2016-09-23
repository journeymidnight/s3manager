import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

let InstanceEipForm = (props) => {
  const { fields:
    { eipId },
    handleSubmit,
    submitting,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">

        <div className="form-group">
          <label className="control-label" >{t('eip')}</label>
          <div className="col-sm-10">
            <select className="form-control" {...eipId}>
              {props.availableEips.map((eip) => {
                return (
                  <option key={eip.eipId} value={eip.eipId}>
                    {eip.name} ({eip.eipId})
                  </option>
                );
              })}
            </select>
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

InstanceEipForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  availableEips: React.PropTypes.array,
  t: React.PropTypes.any,
};

InstanceEipForm.validate = values => {
  const errors = {};
  errors.eipId = Validations.required(values.eipId);
  return errors;
};

InstanceEipForm = reduxForm({
  form: 'InstanceEipForm',
  fields: ['eipId'],
  validate: InstanceEipForm.validate,
})(translate()(InstanceEipForm));

export default InstanceEipForm;
