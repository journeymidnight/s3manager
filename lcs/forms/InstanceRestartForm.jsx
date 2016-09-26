import React from 'react';
import Form, { attach } from '../../shared/components/Form';

class F extends Form {

  static fields = ['restartType'];

  render() {
    const { fields:
      { restartType },
      handleSubmit,
      submitting,
      submitFailed,
      t,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-body">

          <div className="form-group">
            <label className="control-label" >{t('restartType')}</label>
            <div className="col-sm-10">
              <select className="form-control" {...restartType}>
                <option value="SOFT">{t('restartTypes.SOFT')}</option>
                <option value="HARD">{t('restartTypes.HARD')}</option>
              </select>
              {(submitFailed || restartType.touched) && restartType.error && <div className="text-danger"><small>{restartType.error}</small></div>}
            </div>
          </div>

        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
          <button type="submit" className="btn btn-save" disabled={submitting}>
            {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
          </button>
        </div>
      </form>
    );
  }
}

export default attach(F);
