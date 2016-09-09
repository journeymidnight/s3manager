import i18n from '../../shared/i18n';

export const serverErrorHandler = (error) => {
  if (error.retCode === 4113) {
    error.displayMsg = i18n.t('errorMsg.4113');
    return;
  }
};

