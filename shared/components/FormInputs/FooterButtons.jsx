//import React from 'react';
//
//const FooterButtons = (props) => {
//  const {
//    resetForm,
//    submitting,
//    t,
//  } = props;
//
//  return (
//    <div>
//      <button type="submit" className="btn btn-save" disabled={submitting}>
//        {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
//      </button>
//      &nbsp;
//      <button type="button" className="btn btn-cancel" disabled={submitting} onClick={resetForm}>
//        {t('reset')}
//      </button>
//    </div>
//  );
//};
//
//FooterButtons.propTypes = {
//  resetForm: React.PropTypes.func.isRequired,
//  submitting: React.PropTypes.bool.isRequired,
//  t: React.PropTypes.any.isRequired,
//};
//
//export default FooterButtons;
//
import React from 'react';

const FooterButtons = (props) => {
  const {
    submitting,
    closeForm,
    t,
  } = props;

  return (
    <div style={{ overflow: 'hidden' }}>
      <button type="submit" className="button" disabled={submitting}>
        {t('update')}
      </button>
      &nbsp;
      {closeForm && <button type="button" onClick={closeForm} className="button button-white">{t('closeModal')}</button>}

    </div>
  );
};

FooterButtons.propTypes = {
  submitting: React.PropTypes.bool.isRequired,
  closeForm: React.PropTypes.func,
  t: React.PropTypes.any.isRequired,
};

export default FooterButtons;
