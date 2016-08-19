import React from 'react';
import Form, { Input, TextArea, Action, attach } from '../../shared/components/Form';
import * as Validations from '../../shared/utils/validations';

class F extends Form {

  static fields = ['name', 'publicKey', 'description'];

  static validate(values) {
    const errors = {};
    errors.name = Validations.required(values.name);
    return errors;
  }

  render() {
    const {
      fields: { name, description, publicKey },
      handleSubmit, t,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <Input form={this.props} field={name} label={t('name')} />
        <Input form={this.props} field={description} label={t('description')} />
        <TextArea form={this.props} field={publicKey} label={t('formKeyPairForm.publicKey')} />

        <Action form={this.props} submitLabel={t('create')} />
      </form>
    );
  }
}

export default attach(F);
