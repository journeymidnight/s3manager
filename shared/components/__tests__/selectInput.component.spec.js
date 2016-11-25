import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import SelectInput from '../../components/FormInputs/SelectInput';
import i18n from '../../i18n';

describe('<SelectInput />', () => {
  const t = i18n.t.bind(i18n);
  it('should render', () => {
    const wrapper = shallow(
      <SelectInput
        item={{
          touched: false,
        }}
        itemName="textName"
        optionList={[
          { value: 'value1', text: 'text1' },
          { value: 'value2', text: 'text2' },
        ]}
        optionValue="value"
        optionText="text"
        helpText="test.helpText"
        t={t}
      />
    );

    expect(wrapper.hasClass('form-group')).to.equal(true);
    expect(wrapper.find('.control-label').text()).to.equal('textName');
    expect(wrapper.find('select')).to.have.length(1);
    expect(wrapper.find('.form-control').props().touched).to.equal(false);
    expect(wrapper.find('option')).to.have.length(2);
    expect(wrapper.find('select').childAt(0).prop('value')).to.equal('value1');
    expect(wrapper.find('select').childAt(0).text()).to.equal('text1');
    expect(wrapper.find('.help-block').text()).to.equal('This is help text');
  });

  it('should allow us to input', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <SelectInput
        item={{
          onChange,
        }}
        itemName="textName"
        optionList={[
          { value: 'value1', text: 'text1' },
          { value: 'value2', text: 'text2' },
        ]}
        optionValue="value"
        t={t}
      />
    );

    wrapper.find('.form-control').simulate('change');
    expect(onChange.calledOnce).to.equal(true);
  });
});
