import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import NumericTextBox from '../../shared/components/NumericTextBox';
import * as Validations from '../../shared/utils/validations';

class F extends React.Component {

  componentDidMount() {
    const initialValues = {
      name: '',
      count: 1,
      bandwidth: 1,
    };
    this.props.initializeForm(initialValues);
  }

  render() {
    const { fields:
      { name, count, bandwidth },
      handleSubmit,
      submitting,
      submitFailed,
      resetForm,
      t,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <div className={(submitFailed || name.touched) && name.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('name')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...name} />
            {(submitFailed || name.touched) && name.error && <div className="text-danger"><small>{name.error}</small></div>}
          </div>
        </div>

        <div className={(submitFailed || bandwidth.touched) && bandwidth.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('bandwidth')}</label>
          <div className="col-sm-10">
            <input type="hidden" className="form-control" {...bandwidth} />
            <NumericTextBox min={1} max={300} step={1} value={bandwidth.value} onChange={param => bandwidth.onChange(param)} />
            {(submitFailed || bandwidth.touched) && bandwidth.error && <div className="text-danger"><small>{bandwidth.error}</small></div>}
            <p className="help-block">{t('pageEipCreate.bandwidthHint')}</p>
          </div>
        </div>

        <div className={(submitFailed || count.touched) && count.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('count')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...count} />
            {(submitFailed || count.touched) && count.error && <div className="text-danger"><small>{count.error}</small></div>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-save" disabled={submitting}>
            {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('create')}
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
};

F.validate = values => {
  const errors = {};
  errors.name = Validations.required(values.name);
  errors.count = Validations.integer(values.count);
  errors.bandwidth = Validations.integer(values.bandwidth);
  return errors;
};

export default reduxForm({
  form: 'EipForm',
  fields: ['name', 'count', 'bandwidth'],
  validate: F.validate,
})(translate()(F));
