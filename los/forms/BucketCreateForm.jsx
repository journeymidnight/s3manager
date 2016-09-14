import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';
import i18n from '../../shared/i18n';

class F extends React.Component {
  render() {
    return (
      <div>Hello World</div>
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
