import _ from 'lodash';
import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import * as Validations from '../../shared/utils/validations';

class InstanceResizeForm extends React.Component {

  constructor(props) {
    super(props);

    this.onChangeInstanceType = this.onChangeInstanceType.bind(this);
    this.state = { initialized: false };
  }

  componentDidMount() {
    const { region } = this.props;

    IaaS
      .doAction(region.regionId, ACTION_NAMES.describeInstanceTypes, {
        status: ['active'],
        limit: 100,
      })
      .promise
      .then((payload) => {
        this.instanceTypeSet = payload.instanceTypeSet;

        const instanceTypes = {};
        this.instanceTypeSet.forEach((instanceType) => {
          if (!instanceTypes[instanceType.vcpus]) {
            instanceTypes[instanceType.vcpus] = {};
          }
          if (!instanceTypes[instanceType.vcpus][instanceType.memory]) {
            instanceTypes[instanceType.vcpus][instanceType.memory] = {};
          }
          if (!instanceTypes[instanceType.vcpus][instanceType.memory][instanceType.disk]) {
            instanceTypes[instanceType.vcpus][instanceType.memory][instanceType.disk] = [];
          }
          instanceTypes[instanceType.vcpus][instanceType.memory][instanceType.disk].push(instanceType);
        });

        const initialValues = {
          vcpus: _.keys(instanceTypes)[0],
          memory: _.keys(_.values(instanceTypes)[0])[0],
          disk: _.keys(_.values(_.values(instanceTypes)[0])[0])[0],
          instanceTypeId: _.values(_.values(_.values(instanceTypes)[0])[0])[0][0].instanceTypeId,
        };

        this.instanceTypes = instanceTypes;
        this.props.initializeForm(initialValues);

        this.setState({ initialized: true });
      });
  }

  onChangeInstanceType(values) {
    const { instanceTypes } = this;
    const { vcpus, memory, disk, instanceTypeId } = this.props.fields;

    let newVCPUs = values.vcpus || vcpus.value;
    let newMemory = values.memory || memory.value;
    let newDisk = values.disk || disk.value;

    if (instanceTypes[newVCPUs] === undefined) {
      newVCPUs = _.keys(instanceTypes)[0];
    }

    if (instanceTypes[newVCPUs][newMemory] === undefined) {
      newMemory = _.keys(instanceTypes[newVCPUs])[0];
    }
    if (instanceTypes[newVCPUs][newMemory][newDisk] === undefined) {
      newDisk = _.keys(instanceTypes[newVCPUs][newMemory])[0];
    }

    vcpus.onChange(newVCPUs);
    memory.onChange(newMemory);
    disk.onChange(newDisk);

    if (instanceTypeId.value !== instanceTypes[newVCPUs][newMemory][newDisk][0].instanceTypeId) {
      instanceTypeId.onChange(instanceTypes[newVCPUs][newMemory][newDisk][0].instanceTypeId);
    }
  }

  render() {
    if (!this.state.initialized) {
      return <div />;
    }

    const { fields:
      { vcpus, memory, disk, instanceTypeId },
      handleSubmit,
      submitting,
      t,
      invalid,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-body">

          <input type="hidden" className="form-control" {...instanceTypeId} />

          <div className="form-group">
            <label className="control-label" >{t('vcpus')}</label>
            <div className="col-sm-10">
              <ul className="options">
                {_.keys(this.instanceTypes).map((_vcpus) => {
                  return (
                    <li
                      key={_vcpus}
                      className={(_vcpus === vcpus.value) ? 'selected' : ''}
                      onClick={() => { this.onChangeInstanceType({ vcpus: _vcpus }); }}
                    >
                      {_vcpus} {t('cpuCore')}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label" >{t('memory')}</label>
            <div className="col-sm-10">
              <ul className="options">
                {_.keys(this.instanceTypes[vcpus.value]).map((_memory) => {
                  return (
                    <li
                      key={_memory}
                      className={(_memory === memory.value) ? 'selected' : ''}
                      onClick={() => { this.onChangeInstanceType({ memory: _memory }); }}
                    >
                      {_memory} MB
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label" >{t('disk')}</label>
            <div className="col-sm-10">
              <ul className="options">
                {_.keys(this.instanceTypes[vcpus.value][memory.value]).map((_disk) => {
                  return (
                    <li
                      key={_disk}
                      className={(_disk === disk.value) ? 'selected' : ''}
                      onClick={() => { this.onChangeInstanceType({ disk: _disk }); }}
                    >
                      {_disk} GB
                    </li>
                  );
                })}
              </ul>
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
  }
}

InstanceResizeForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  instance: React.PropTypes.object.isRequired,
  region: React.PropTypes.object.isRequired,
  t: React.PropTypes.any,
};

InstanceResizeForm.validate = values => {
  const errors = {};
  errors.instanceTypeId = Validations.required(values.instanceTypeId);
  return errors;
};

InstanceResizeForm = reduxForm({
  form: 'InstanceResizeForm',
  fields: ['vcpus', 'memory', 'disk', 'instanceTypeId'],
  validate: InstanceResizeForm.validate,
})(translate()(InstanceResizeForm));

export default InstanceResizeForm;
