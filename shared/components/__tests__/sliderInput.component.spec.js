import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import SliderInput from '../../components/FormInputs/SliderInput';
import Slider from '../../components/Slider';
import i18n from '../../i18n';

describe('<SliderInput />', () => {
  const t = i18n.t.bind(i18n);
  it('should render', () => {
    const wrapper = shallow(
      <SliderInput
        item={{
          value: 5,
        }}
        itemName="textName"
        max={10}
        min={2}
        step={2}
        helpText="test.helpText"
        t={t}
      />
    );

    expect(wrapper.hasClass('form-group')).to.equal(true);
    expect(wrapper.find('.control-label').text()).to.equal('textName');
    expect(wrapper.find('.form-control').prop('type')).to.equal('hidden');
    expect(wrapper.find('.form-control').prop('value')).to.equal(5);
    expect(wrapper.find('.form-control').prop('disabled')).to.equal('disabled');
    expect(wrapper.find('.help-block').text()).to.equal('This is help text');
  });

  it('should render <Slider />', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <SliderInput
        item={{
          value: 5,
          onChange,
        }}
        itemName="textName"
        max={10}
        min={2}
        step={2}
        unit="MB"
        t={t}
      />
    );

    expect(wrapper.find(Slider)).to.have.length(1);
    expect(wrapper.find(Slider).prop('max')).to.equal(10);
    expect(wrapper.find(Slider).prop('min')).to.equal(2);
    expect(wrapper.find(Slider).prop('step')).to.equal(2);
    expect(wrapper.find(Slider).prop('value')).to.equal(5);
    expect(wrapper.find(Slider).prop('unit')).to.equal('MB');
    expect(wrapper.find('.preview')).to.have.length(1);
    wrapper.find('.preview').simulate('blur');
    expect(onChange.called).to.equal(true);
  });
});
