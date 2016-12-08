import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import NumericTextBox from '../../shared/components/NumericTextBox';
import Slider from '../../shared/components/Slider';
import * as Validations from '../../shared/utils/validations';

class F extends React.Component {
  componentDidMount() {
    const initialValues = {
      name: '',
      snapshotId: undefined,
      size: 10,
      count: 1,
    };
    this.props.initializeForm(initialValues);
  }

  render() {
    const { fields:
      { name, snapshotId, size, count },
      handleSubmit,
      submitting,
      submitFailed,
      resetForm,
      t,
    } = this.props;
    const selectedSnapshot = snapshotId.value ? this.props.availableSnapshots.filter((snapshot) => {
      return snapshot.snapshotId === snapshotId.value;
    })[0] : null;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <div className={(submitFailed || name.touched) && name.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('name')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...name} maxLength="50" />
            {(submitFailed || name.touched) && name.error && <div className="text-danger"><small>{name.error}</small></div>}
          </div>
        </div>

        <input type="hidden" className="form-control" {...snapshotId} />
        {/* this.props.availableSnapshots.length > 0 && <div className={submitFailed && snapshotId.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('pageVolume.snapshot')}</label>
          <div className="col-sm-10">
            { <select className="form-control" {...snapshotId}>
              <option value="">{t('pageVolume.selectSnapshotPlease')}</option>
              {this.props.availableSnapshots.map((snapshot) => {
                return <option key={snapshot.snapshotId} value={snapshot.snapshotId}>{snapshot.name} ({snapshot.snapshotId})</option>;
              })}
            </select> }
            <Selector
              data={this.props.availableSnapshots}
              selectedSnapshot={selectedSnapshot}
              defaultValue={t('pageVolume.selectSnapshotPlease')}
              onChange={param => snapshotId.onChange(param)}
            />
            {submitFailed && snapshotId.error && <div className="text-danger"><small>{snapshotId.error}</small></div>}
          </div>
        </div> */}

        {size.value && !selectedSnapshot && <div className={(submitFailed || size.touched) && size.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('size')}</label>
          <div className="col-sm-10">
            <input type="hidden" className="form-control" {...size} />
            <Slider min={10} max={1024} step={10} value={size.value} unit={'GB'} onChange={param => size.onChange(param)} />
            {(submitFailed || size.touched) && size.error && <div className="text-danger"><small>{size.error}</small></div>}
          </div>
        </div>}

        {size.value && selectedSnapshot && <div className="form-group">
          <label className="control-label" >{t('size')}</label>
          <div className="col-sm-10">
            <input type="hidden" className="form-control" value={selectedSnapshot.size} disabled="disabled" />
            <Slider min={1} max={1024} step={1} value={size.value} onChange={param => size.onChange(param)} />
          </div>
        </div>}

        {count.value && <div className={(submitFailed || count.touched) && count.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('count')}</label>
          <div className="col-sm-10">
            <input type="hidden" className="form-control" {...count} />
            <NumericTextBox min={1} max={20} step={1} value={count.value} onChange={param => count.onChange(param)} />
            {(submitFailed || count.touched) && count.error && <div className="text-danger"><small>{count.error}</small></div>}
          </div>
        </div>}

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
  }
}

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  initializeForm: React.PropTypes.func.isRequired,
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
