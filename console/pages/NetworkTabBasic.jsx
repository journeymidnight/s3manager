import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as NetworkActions from '../redux/actions.network';

let NetworkDeleteForm = (props) => {
  const {
    handleSubmit,
    submitting,
    t,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="btn btn-danger" disabled={submitting}>
        {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('delete')}
      </button>
    </form>
  );
};

NetworkDeleteForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

NetworkDeleteForm = reduxForm({
  form: 'NetworkDeleteForm',
  fields: [],
})(translate()(NetworkDeleteForm));

let NetworkUpdateForm = (props) => {
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

NetworkUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

NetworkUpdateForm.validate = () => {
  const errors = {};
  return errors;
};

NetworkUpdateForm = reduxForm({
  form: 'KeyPairForm',
  fields: ['name', 'description'],
  validate: NetworkUpdateForm.validate,
})(translate()(NetworkUpdateForm));

class C extends RegionPage {

  constructor(props) {
    super(props);

    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete() {
    const { dispatch, region, routerKey } = this.props;
    const { network } = this.props;

    return new Promise((resolve, reject) => {
      dispatch(NetworkActions.requestDeleteNetworks(routerKey, region.regionId, [network.networkId]))
      .then(() => {
        dispatch(NetworkActions.requestDescribeNetwork(routerKey, region.regionId, network.networkId));
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  onSave(values) {
    const { dispatch, region, routerKey } = this.props;
    const { network } = this.props;

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

  notDeleted() {
    const { network } = this.props;
    return network.status !== 'deleted' && network.status !== 'ceased';
  }

  render() {
    const { t, network } = this.props;

    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">{t('pageNetwork.basic')}</div>
          <div className="panel-body">

            <dl className="dl-horizontal">
              <dt>{t('id')}</dt>
              <dd>{network.networkId}</dd>
              <dt>{t('name')}</dt>
              <dd>
              {network.name && <strong>{network.name}</strong>}
              {!network.name && <i className="text-muted">{t('noName')}</i>}
              </dd>
              <dt>{t('description')}</dt>
              <dd>
              {network.description && <strong>{network.description}</strong>}
              {!network.description && <i className="text-muted">{t('noName')}</i>}
              </dd>
              <dt>{t('pageNetwork.externalGatewayIp')}</dt>
              <dd>
              {network.externalGatewayIp && <strong>{network.externalGatewayIp}</strong>}
              {!network.externalGatewayIp && <i className="text-muted">{t('noName')}</i>}
              </dd>
              <dt>{t('status')}</dt>
              <dd className={`i-status i-status-${network.status}`}>
                <i className="icon"></i>
                {t(`networkStatus.${network.status}`)}
              </dd>
              <dt>{t('created')}</dt>
              <dd>{network.created}</dd>
            </dl>

          </div>
        </div>

        {this.notDeleted() && <div className="panel panel-primary">
          <div className="panel-heading">{t('pageNetwork.updateNetwork')}</div>
          <div className="panel-body">
            <NetworkUpdateForm onSubmit={this.onSave} initialValues={network} />
          </div>
        </div>}

        {this.notDeleted() && <div className="panel panel-danger">
          <div className="panel-heading">{t('pageNetwork.deleteNetwork')}</div>
          <div className="panel-body">
            <NetworkDeleteForm onSubmit={this.onDelete} />
          </div>
        </div>}
      </div>
    );
  }
}

export default attach(C);
