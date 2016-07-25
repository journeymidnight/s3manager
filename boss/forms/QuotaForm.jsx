import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Select from 'react-select';
import IAM from '../services/iam';
import * as Validations from '../../shared/utils/validations';

class F extends React.Component {

  constructor(props) {
    super(props);

    this.onBlur = this.onBlur.bind(this);
  }

  onBlur() {
    this.props.fields.projectId.onBlur(this.props.fields.projectId.value);
  }

  getOptions(input, callback) {
    IAM
    .describeProjects({
      searchWord: input,
    })
    .promise
    .then((payload) => {
      callback(null, {
        options: payload.projectSet.map((project) => {
          return {
            value: project.projectId,
            label: `${project.name} (${project.projectId})`,
          };
        }),
      });
    })
    .catch(() => {
    });
  }

  render() {
    const {
      fields: {
        projectId,
        instances,
        vCPUs,
        memory,
        images,
        eIPs,
        volumes,
        volumeSize,
        keyPairs,
        networks,
        snapshots,
      },
      handleSubmit,
      resetForm,
      submitting,
      submitFailed,
      isUpdate,
      t,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={submitFailed && projectId.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.projectId')}</label>
          <div className="col-sm-10">
            <Select.Async
              loadOptions={this.getOptions}
              noResultsText={t('nothingHere')}
              disabled={isUpdate}
              {...projectId}
              onBlur={this.onBlur}
            />
            {submitFailed && projectId.error && <div className="text-danger"><small>{projectId.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && instances.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.instances')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...instances} />
            {submitFailed && instances.error && <div className="text-danger"><small>{instances.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && vCPUs.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.vCPUs')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...vCPUs} />
            {submitFailed && vCPUs.error && <div className="text-danger"><small>{vCPUs.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && memory.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.memory')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...memory} />
            {submitFailed && memory.error && <div className="text-danger"><small>{memory.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && images.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.images')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...images} />
            {submitFailed && images.error && <div className="text-danger"><small>{images.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && eIPs.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.eIPs')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...eIPs} />
            {submitFailed && eIPs.error && <div className="text-danger"><small>{eIPs.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && volumes.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.volumes')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...volumes} />
            {submitFailed && volumes.error && <div className="text-danger"><small>{volumes.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && volumeSize.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.volumeSize')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...volumeSize} />
            {submitFailed && volumeSize.error && <div className="text-danger"><small>{volumeSize.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && keyPairs.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.keyPairs')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...keyPairs} />
            {submitFailed && keyPairs.error && <div className="text-danger"><small>{keyPairs.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && networks.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.networks')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...networks} />
            {submitFailed && networks.error && <div className="text-danger"><small>{networks.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && snapshots.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formQuotaForm.snapshots')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...snapshots} />
            {submitFailed && snapshots.error && <div className="text-danger"><small>{snapshots.error}</small></div>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-save" disabled={submitting}>
            {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
          </button>
          <button type="button" className="btn pull-right" disabled={submitting} onClick={resetForm}>
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
  handleSubmit: React.PropTypes.func.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  isUpdate: React.PropTypes.bool,
  t: React.PropTypes.any,
};

F.validate = values => {
  const errors = {};
  errors.projectId = Validations.required(values.projectId);
  errors.instances = Validations.required(values.instances);
  errors.vCPUs = Validations.required(values.vCPUs);
  errors.memory = Validations.required(values.memory);
  errors.images = Validations.required(values.images);
  errors.eIPs = Validations.required(values.eIPs);
  errors.volumes = Validations.required(values.volumes);
  errors.volumeSize = Validations.required(values.volumeSize);
  errors.keyPairs = Validations.required(values.keyPairs);
  errors.networks = Validations.required(values.networks);
  errors.snapshots = Validations.required(values.snapshots);
  return errors;
};

export default reduxForm({
  form: 'ProjectForm',
  fields: [
    'projectId',
    'instances',
    'vCPUs',
    'memory',
    'images',
    'eIPs',
    'volumes',
    'volumeSize',
    'keyPairs',
    'networks',
    'snapshots',
  ],
  validate: F.validate,
})(translate()(F));
