import expect from 'expect';
import i18n from '../i18n';

describe('i18n', () => {
  it('#authLogin', () => {
    expect(i18n.t('appName')).toEqual('LeStack');
  });
});
