import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import _ from 'lodash';
import Page, { attach } from '../../shared/pages/Page';
import Modal, { confirmModal } from '../../shared/components/Modal';
import * as Actions from '../redux/actions';
import * as NetworkActions from '../redux/actions.network';

let NetworkUpdateForm = (props) => {
  const { fields:
    { name, description },
    handleSubmit,
    submitting,
    submitFailed,
    t,
    invalid,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">

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
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
        <button type="submit" className="btn btn-save" disabled={submitting || invalid}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
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

class C extends Page {

  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.refresh = this.refresh.bind(this);
    this.deleteNetwork = this.deleteNetwork.bind(this);
    this.updateNetwork = this.updateNetwork.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), `/${region.regionId}/networks`));

    this.setInterval(() => {
      this.refresh();
    }, 2000);
  }

  refresh() {
    const { dispatch, region, routerKey, params } = this.props;

    const networkId = params.networkId;
    dispatch(NetworkActions.requestDescribeNetwork(routerKey, region.regionId, networkId))
    .then(() => {
      this.network = this.props.context.network;
    });
  }

  isEnabled(network) {
    return network.status !== 'deleted' && network.status !== 'ceased' && network.status !== 'error';
  }

  isDeletable(network) {
    return network.status !== 'deleted' && network.status !== 'ceased';
  }

  onUpdate(values) {
    const { dispatch, region, routerKey } = this.props;
    const network = this.props.context.network || this.network;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(NetworkActions.requestModifyNetworkAttributes(routerKey, region.regionId, network.networkId, name, description))
      .then(() => {
        resolve();
        this.refs.updateModal.hide();
      }).catch(() => {
        reject();
      });
    });
  }

  updateNetwork(e) {
    e.preventDefault();
    this.refs.updateModal.show();
  }

  deleteNetwork(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey, params } = this.props;

    confirmModal(t('confirmDelete'), () => {
      dispatch(NetworkActions.requestDeleteNetworks(routerKey, region.regionId, [params.networkId]));
    });
  }

  render() {
    const { t, region, params } = this.props;

    const network = this.props.context.network || this.network;
    if (!network || network.networkId !== params.networkId) {
      this.refresh();

      return <div />;
    }

    let active = 'router';
    if (_.endsWith(this.props.location.pathname, 'subnets')) {
      active = 'subnets';
    } else if (_.endsWith(this.props.location.pathname, 'router')) {
      active = 'router';
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                <i className="light">
                  {network.networkId}
                </i>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageNetwork.basic')}
                    {this.isEnabled(network) && <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a href onClick={this.updateNetwork}>{t('pageNetwork.updateNetwork')}</a></li>
                        <li><a href onClick={this.deleteNetwork}>{t('pageNetwork.deleteNetwork')}</a></li>
                      </ul>
                    </div>}
                    {!this.isEnabled(network) && this.isDeletable(network) && <div className="btn-group pull-right">
                      <button type="button" className="btn" onClick={this.deleteNetwork}>
                        {t('pageNetwork.deleteNetwork')}
                      </button>
                    </div>}
                  </div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td>{network.networkId}</td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                        {network.name && <strong>{network.name}</strong>}
                        {!network.name && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('description')}</td>
                        <td>
                        {network.description && <strong>{network.description}</strong>}
                        {!network.description && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('pageNetwork.externalGatewayIp')}</td>
                        <td>
                        {network.externalGatewayIp && <strong>{network.externalGatewayIp}</strong>}
                        {!network.externalGatewayIp && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${network.status}`}>
                          <i className="icon"></i>
                          {t(`networkStatus.${network.status}`)}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td>{network.created}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {this.isEnabled(network) && <div className="col-md-8 tabs">
                <ul className="nav-links clearfix">
                  <li className={`pull-left ${(active === 'router') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`/${region.regionId}/networks/${network.networkId}/router`}>
                      {t('pageNetwork.router')}
                    </Link>
                  </li>
                  <li className={`pull-left ${(active === 'subnets') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`/${region.regionId}/networks/${network.networkId}/subnets`}>
                      {t('pageNetwork.subnets')}
                    </Link>
                  </li>
                </ul>
                <div>
                  {React.cloneElement(this.props.children, { network })}
                </div>
              </div>}
            </div>

          </div>
        </div>
        <Modal title={t('pageNetwork.updateNetwork')} ref="updateModal" >
          <NetworkUpdateForm onSubmit={this.onUpdate} initialValues={network} />
        </Modal>
      </div>
    );
  }
}

export default attach(C);
