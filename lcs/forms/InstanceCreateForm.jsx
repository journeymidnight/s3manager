import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';
import i18n from '../../shared/i18n';

class F extends React.Component {

  constructor(props) {
    super(props);

    this.onChangeInstanceType = this.onChangeInstanceType.bind(this);
  }

  componentDidMount() {
    const instanceTypes = {};
    this.props.instanceTypeSet.forEach((instanceType) => {
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
      count: 1,
      subnetId: this.props.networkSet[0].subnets[0].subnetId,
      imageType: 'public',
      imageId: this.props.publicImageSet[0].imageId,
      loginMode: 'password',
    };

    if (this.props.keyPairSet.length > 0) {
      initialValues.keyPairId = this.props.keyPairSet[0].keyPairId;
    }

    this.instanceTypes = instanceTypes;
    this.props.initializeForm(initialValues);
  }

  onChangeImageType(value) {
    const { imageType, imageId } = this.props.fields;

    imageType.onChange(value);
    const imageSet = value === 'public' ? this.props.publicImageSet : this.props.privateImageSet;
    imageId.onChange(imageSet[0] && imageSet[0].imageId);
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
    const { fields:
      { hostname, imageType, imageId, vcpus, memory, disk, instanceTypeId, subnetId, count, keyPairId, loginPassword, loginMode },
      handleSubmit,
      submitting,
      submitFailed,
      resetForm,
      t,
      service,
    } = this.props;

    const imageSet = imageType.value === 'public' ? this.props.publicImageSet : this.props.privateImageSet;
    const selectedImage = Array.isArray(imageSet) && imageSet.filter((image) => {
      return image.imageId === imageId;
    })[0];
    const isSelectedWindowsImage = selectedImage && selectedImage.platform === 'windows';
    if (isSelectedWindowsImage) {
      loginMode.onChange('password');
    }
    const defaultUser = isSelectedWindowsImage ? 'leuser' : 'leuser';

    if (!vcpus.value) {
      // not initialized
      return <div />;
    }

    return (
      <form className="form-horizontal" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label className="control-label" >{t('pageInstanceCreate.imageType')}</label>
          <div className="col-sm-10">
            <label className="radio inline">
              <input type="radio" value="public" onChange={() => {}} onClick={() => { this.onChangeImageType('public'); }} checked={imageType.value === 'public'} />
              {t('public_images')}
            </label>
            {this.props.privateImageSet.length > 0 && <label className="radio inline">
              <input type="radio" value="private" onChange={() => {}} onClick={() => { this.onChangeImageType('private'); }} checked={imageType.value === 'private'} />
              {t('private_images')}
            </label>}
          </div>
        </div>
        <div className="form-group">
          <label className="control-label" >{t('pageInstanceCreate.image')}</label>
          <div className="col-sm-10">
            <select className="form-control" {...imageId}>
              {imageSet.map((image) => {
                return imageType.value === 'public' ?
                  <option key={image.imageId} value={image.imageId}>{image.name}</option> :
                  <option key={image.imageId} value={image.imageId}>{image.name} ({image.imageId})</option>;
              })}
            </select>
          </div>
        </div>

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

        <div className={submitFailed && count.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('formInstanceCreateForm.count')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...count} />
            {submitFailed && count.error && <div className="text-danger"><small>{count.error}</small></div>}
          </div>
        </div>

        <fieldset className="features">
          <legend>{t('pageInstanceCreate.network')}</legend>

          <div className="form-group">
            <label className="control-label" >{t('network')}</label>
            <div className="col-sm-10">
              <ul className="options-vertical">
                {this.props.networkSet.map((network) => {
                  return (
                    <div key={network.networkId}>
                      <div style={{ padding: '6px 0' }}>
                        <i>
                          <Link target="_blank" to={`${service.servicePath}/networks/${network.networkId}`}>{network.networkId}</Link>
                        </i>
                        &nbsp;<b>{network.name}</b>
                      </div>
                      {network.subnets.map((subnet) => {
                        return (
                          <li
                            key={subnet.subnetId}
                            className={(subnet.subnetId === subnetId.value) ? 'selected' : ''}
                            onClick={() => { subnetId.onChange(subnet.subnetId); }}
                          >
                            {subnet.cidr}
                            <i className="text-muted pull-right">
                              {subnet.subnetId}
                            </i>
                          </li>
                        );
                      })}
                    </div>
                  );
                })}
              </ul>
            </div>
          </div>
        </fieldset>

        <fieldset className="features">
          <legend>{t('pageInstanceCreate.basic')}</legend>

          <div className={submitFailed && hostname.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('pageInstanceCreate.hostname')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" {...hostname} />
              {submitFailed && hostname.error && <div className="text-danger"><small>{hostname.error}</small></div>}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label" >{t('pageInstanceCreate.loginMode')}</label>
            <div className="col-sm-10">
              <div>
                <label className="radio inline">
                  <input type="radio" checked={loginMode.value === 'password'} name="input_login_mode" onChange={() => {}} onClick={() => { loginMode.onChange('password'); }} />
                  {t('pageInstanceCreate.loginPassword')}
                </label>
                {!isSelectedWindowsImage && <label className="radio inline">
                  <input type="radio" checked={loginMode.value === 'keyPair'} name="input_login_mode" onChange={() => {}} onClick={() => { loginMode.onChange('keyPair'); }} />
                  {t('pageInstanceCreate.keyPair')}&nbsp;
                </label>}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label" >{t('pageInstanceCreate.defaultUser')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" value={defaultUser} disabled="disabled" />
            </div>
          </div>

          {!isSelectedWindowsImage && loginMode.value === 'keyPair' && <div className="form-group">
            <label className="control-label" >{t('pageInstanceCreate.keyPair')}</label>
            <div className="col-sm-10">
              {this.props.keyPairSet.length > 0 && <select className="form-control" {...keyPairId}>
                {this.props.keyPairSet.map((keyPair) => {
                  return (
                    <option key={keyPair.keyPairId} value={keyPair.keyPairId}>
                      {keyPair.name} ({keyPair.keyPairId})
                    </option>
                  );
                })}
              </select>}
              {this.props.keyPairSet.length === 0 && <Link className="btn btn-new" to={`${service.servicePath}/key_pairs/create`}>{t('pageKeyPairCreate.createKeyPair')}</Link>}
            </div>
          </div>}

          {loginMode.value === 'password' && <div className={submitFailed && loginPassword.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('pageInstanceCreate.loginPassword')}</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" {...loginPassword} />
              {submitFailed && loginPassword.error && <div className="text-danger"><small>{loginPassword.error}</small></div>}
              <p className="help-block">{t('pageInstanceCreate.passwordHint')}</p>
            </div>
          </div>}

        </fieldset>

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
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
  publicImageSet: React.PropTypes.array,
  privateImageSet: React.PropTypes.array,
  instanceTypeSet: React.PropTypes.array,
  networkSet: React.PropTypes.array,
  keyPairSet: React.PropTypes.array,
  service: React.PropTypes.object,
};

F.validate = values => {
  const errors = {};
  errors.imageId = Validations.required(values.imageId);
  errors.instanceTypeId = Validations.required(values.instanceTypeId);
  errors.subnetId = Validations.required(values.subnetId);
  errors.count = Validations.required(values.count);
  if (values.loginMode === 'password') {
    if (Validations.isEmpty(values.loginPassword) || !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/i.test(values.loginPassword)) {
      errors.loginPassword = i18n.t('pageInstanceCreate.passwordNotValid');
    }
  }
  return errors;
};

export default reduxForm({
  form: 'InstanceCreateForm',
  fields: ['hostname', 'imageType', 'imageId', 'vcpus', 'memory', 'disk', 'instanceTypeId', 'subnetId', 'count', 'keyPairId', 'loginPassword', 'loginMode'],
  validate: F.validate,
})(translate()(F));
