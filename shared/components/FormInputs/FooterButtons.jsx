import React from 'react';

const FooterButtons = (props) => {
  const {
    resetForm,
    submitting,
    t,
  } = props;

  return (
    <div>
      <button type="submit" className="btn btn-save" disabled={submitting}>
        {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
      </button>
      &nbsp;
      <button type="button" className="btn btn-cancel" disabled={submitting} onClick={resetForm}>
        {t('reset')}
      </button>
    </div>
  );
};

FooterButtons.propTypes = {
  resetForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any.isRequired,
};

export default FooterButtons;
