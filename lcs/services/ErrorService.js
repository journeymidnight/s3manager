import i18n from '../../shared/i18n';

export const serverErrorHandler = (error) => {
  if (error.retCode === 4113) {
    const resource = /quota\[(\w+)\]/.exec(error.message)[1];
    error.displayMsg = i18n.t('errorMsg.4113').replace('{resource}', i18n.t(`formQuotaForm.${resource}`));
    return;
  }
};
