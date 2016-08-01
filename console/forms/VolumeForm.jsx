import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { name, snapshotId, size, count },
    handleSubmit,
    submitting,
    submitFailed,
    resetForm,
    t,
  } = props;
  const selectedSnapshot = snapshotId.value ? props.availableSnapshots.filter((snapshot) => {
    return snapshot.snapshotId === snapshotId.value;
  })[0] : null;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>

      <div className={submitFailed && name.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('name')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...name} />
          {submitFailed && name.error && <div className="text-danger"><small>{name.error}</small></div>}
        </div>
      </div>

      {props.availableSnapshots.length > 0 && <div className={submitFailed && snapshotId.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('pageVolume.snapshot')}</label>
        <div className="col-sm-10">
          <select className="form-control" {...snapshotId}>
            <option value="">{t('pageVolume.selectSnapshotPlease')}</option>
            {props.availableSnapshots.map((snapshot) => {
              return <option key={snapshot.snapshotId} value={snapshot.snapshotId}>{snapshot.name}</option>;
            })}
          </select>
          {submitFailed && snapshotId.error && <div className="text-danger"><small>{snapshotId.error}</small></div>}
        </div>
      </div>}

      {!selectedSnapshot && <div className={submitFailed && size.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('size')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...size} />
          {submitFailed && size.error && <div className="text-danger"><small>{size.error}</small></div>}
        </div>
      </div>}

      {selectedSnapshot && <div className="form-group">
        <label className="control-label" >{t('size')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" value={selectedSnapshot.size} disabled="disabled" />
        </div>
      </div>}

      <div className={submitFailed && count.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('count')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...count} />
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
  availableSnapshots: React.PropTypes.array,
};

F.validate = values => {
  const errors = {};
  errors.name = Validations.required(values.name);
  errors.size = values.snapshotId ? null : Validations.integer(values.size);
  errors.count = Validations.integer(values.count);
  return errors;
};

export default reduxForm({
  form: 'VolumeForm',
  fields: ['name', 'snapshotId', 'size', 'count'],
  validate: F.validate,
})(translate()(F));
