import expect from 'expect';
import i18n from '../i18n';

describe('i18n', () => {
  it('#appName', () => {
    expect(i18n.t('appName')).toEqual('LeStack');
  });
});
