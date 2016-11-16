import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import NumberInput from '../../components/FormInputs/NumberInput';
import i18n from '../../i18n';

describe('<NumberInput />', () => {
  const t = i18n.t.bind(i18n);
  it('should render', () => {
    const wrapper = shallow(
      <NumberInput
        item={{
          touched: false,
        }}
        submitFailed={false}
        itemName="textName"
        inputParams={{
          max: '10',
          min: '3',
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
    expect(wrapper.find('.form-control').prop('max')).to.equal('10');
    expect(wrapper.find('.form-control').prop('min')).to.equal('3');
    expect(wrapper.find('.text-danger')).to.have.length(0);
    expect(wrapper.find('.help-block').text()).to.equal('This is help text');
  });

  it('should show error when touched', () => {
    const wrapper = shallow(
      <NumberInput
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
      <NumberInput
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

  it('should allow us to input', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <NumberInput
        item={{
          touched: false,
          onChange,
        }}
        submitFailed={false}
        itemName="textName"
        t={t}
      />
    );

    wrapper.find('.form-control').simulate('change');
    expect(onChange.calledOnce).to.equal(true);
  });
});
