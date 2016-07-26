import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

let InstanceVolumeForm = (props) => {
  const { fields:
    { volumeId },
    handleSubmit,
    submitting,
    t,
    invalid,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">

        <div className="form-group">
          <label className="control-label" >{t('volume')}</label>
          <div className="col-sm-10">
            <select className="form-control" {...volumeId}>
              {props.availableVolumes.map((volume) => {
                return (
                  <option key={volume.volumeId} value={volume.volumeId}>
                    {volume.volumeId}({volume.name})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
        <button type="submit" className="btn btn-save" disabled={submitting || invalid}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
        </button>
      </div>
    </form>
  );
};

InstanceVolumeForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  availableVolumes: React.PropTypes.array,
  t: React.PropTypes.any,
};

InstanceVolumeForm.validate = values => {
  const errors = {};
  errors.volumeId = Validations.required(values.volumeId);
  return errors;
};

InstanceVolumeForm = reduxForm({
  form: 'InstanceVolumeForm',
  fields: ['volumeId'],
  validate: InstanceVolumeForm.validate,
})(translate()(InstanceVolumeForm));

export default InstanceVolumeForm;
