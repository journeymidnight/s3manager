import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as NetworkActions from '../redux/actions.network';

const F = (props) => {
  const { fields:
    { name, description },
    handleSubmit,
    submitting,
    submitFailed,
    resetForm,
    t,
    invalid,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>

      <div className={submitFailed && name.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('name')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...name} />
          {submitFailed && name.error && <div className="text-danger"><small>{name.error}</small></div>}
        </div>
      </div>

      <div className={submitFailed && description.error ? 'form-group has-error' : 'form-group'}>
        <label className="control-label" >{t('description')}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" {...description} />
          {submitFailed && description.error && <div className="text-danger"><small>{description.error}</small></div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-save" disabled={submitting || invalid}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
        </button>
        &nbsp;
        <button type="button" className="btn btn-cancel" disabled={submitting} onClick={resetForm}>
          {t('reset')}
        </button>
      </div>
    </form>
  );
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

F.validate = () => {
  const errors = {};
  return errors;
};

const NetworkForm = reduxForm({
  form: 'KeyPairForm',
  fields: ['name', 'description'],
  validate: F.validate,
})(translate()(F));

class C extends RegionPage {

  constructor(props) {
    super(props);

    this.onSave = this.onSave.bind(this);
  }

  onSave(values) {
    const { dispatch, region, routerKey } = this.props;
    const { network } = this.props.context;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(NetworkActions.requestModifyNetworkAttributes(routerKey, region.regionId, network.networkId, name, description))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  render() {
    const { t } = this.props;
    const { network } = this.props.context;

    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">{t('pageNetwork.basic')}</div>
          <div className="panel-body">
            <form className="form-horizontal">

              <div className="form-group">
                <label className="control-label" >{t('id')}</label>
                <div className="col-sm-10">
                  <p>{network.networkId}</p>
                </div>
              </div>

              <div className="form-group">
                <label className="control-label" >{t('name')}</label>
                <div className="col-sm-10">
                  <p>
                  {network.name && <strong>{network.name}</strong>}
                  {!network.name && <i className="text-muted">{t('noName')}</i>}
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label className="control-label" >{t('description')}</label>
                <div className="col-sm-10">
                  <p>
                  {network.description && <strong>{network.description}</strong>}
                  {!network.description && <i className="text-muted">{t('noName')}</i>}
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label className="control-label" >{t('status')}</label>
                <div className="col-sm-10">
                  <p className={`i-status i-status-${network.status}`}>
                    <i className="icon"></i>
                    {t(`networkStatus.${network.status}`)}
                  </p>
                </div>
              </div>

            </form>
          </div>
        </div>

        <div className="panel panel-primary">
          <div className="panel-heading">{t('settings')}</div>
          <div className="panel-body">
            <NetworkForm onSubmit={this.onSave} initialValues={network} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
