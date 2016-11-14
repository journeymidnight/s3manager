import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TextInput from '../../components/FormInputs/TextInput';
import i18n from '../../i18n';

describe('<TextInput />', () => {
  const t = i18n.t.bind(i18n);
  it('should render', () => {
    const wrapper = shallow(
      <TextInput
        item={{
          touched: false,
        }}
        submitFailed={false}
        itemName="textName"
        inputParams={{
          maxLength: '10',
          minLength: '3',
        }}
        helpText="test.helpText"
        t={t}
      />
    );

    expect(wrapper.hasClass('form-group')).to.equal(true);
    expect(wrapper.hasClass('has-error')).to.equal(false);
    expect(wrapper.find('.control-label').text()).to.equal('textName');
    expect(wrapper.find('.form-control').prop('touched')).to.equal(false);
    expect(wrapper.find('.form-control').prop('error')).to.equal(undefined);
    expect(wrapper.find('.form-control').prop('maxLength')).to.equal('10');
    expect(wrapper.find('.form-control').prop('minLength')).to.equal('3');
    expect(wrapper.find('.text-danger')).to.have.length(0);
    expect(wrapper.find('.help-block').text()).to.equal('This is help text');
  });

  it('should show error when touched', () => {
    const wrapper = shallow(
      <TextInput
        item={{
          touched: true,
          error: 'This is error message',
        }}
        submitFailed={false}
        itemName="textName"
        t={t}
      />
    );

    expect(wrapper.hasClass('has-error')).to.equal(true);
    expect(wrapper.find('.text-danger').text()).to.equal('This is error message');
  });

  it('should show error when submitFailed', () => {
    const wrapper = shallow(
      <TextInput
        item={{
          touched: false,
          error: 'This is error message',
        }}
        submitFailed
        itemName="textName"
        t={t}
      />
    );

    expect(wrapper.hasClass('has-error')).to.equal(true);
    expect(wrapper.find('.text-danger').text()).to.equal('This is error message');
  });
});
