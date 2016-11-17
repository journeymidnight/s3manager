import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import FooterButtons from '../../components/FormInputs/FooterButtons';
import i18n from '../../i18n';

describe('<FooterButtons />', () => {
  const t = i18n.t.bind(i18n);
  it('should render', () => {
    const resetForm = sinon.spy();
    const wrapper = shallow(
      <FooterButtons
        resetForm={resetForm}
        submitting={false}
        t={t}
      />
    );

    expect(wrapper.find('.btn-save')).to.have.length(1);
    expect(wrapper.find('.btn-save').prop('type')).to.equal('submit');
    expect(wrapper.find('.btn-save').prop('disabled')).to.equal(false);
    expect(wrapper.find('.fa')).to.have.length(0);
    expect(wrapper.find('.btn-cancel')).to.have.length(1);
    expect(wrapper.find('.btn-cancel').prop('type')).to.equal('button');
    expect(wrapper.find('.btn-save').prop('disabled')).to.equal(false);
  });

  it('should show spinner when submitting', () => {
    const resetForm = sinon.spy();
    const wrapper = shallow(
      <FooterButtons
        resetForm={resetForm}
        submitting
        t={t}
      />
    );

    expect(wrapper.find('.fa')).to.have.length(1);
  });

  it('should allow us to reset', () => {
    const resetForm = sinon.spy();
    const wrapper = shallow(
      <FooterButtons
        resetForm={resetForm}
        submitting={false}
        t={t}
      />
    );

    wrapper.find('.btn-cancel').simulate('click');
    expect(resetForm.calledOnce).to.equal(true);
  });
});
