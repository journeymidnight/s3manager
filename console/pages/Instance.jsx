import _ from 'lodash';
import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import Modal, { confirmModal } from '../../shared/components/Modal';
import * as Actions from '../redux/actions';
import * as InstanceActions from '../redux/actions.instance';

let InstanceUpdateForm = (props) => {
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

InstanceUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

InstanceUpdateForm.validate = () => {
  const errors = {};
  return errors;
};

InstanceUpdateForm = reduxForm({
  form: 'KeyPairForm',
  fields: ['name', 'description'],
  validate: InstanceUpdateForm.validate,
})(translate()(InstanceUpdateForm));

class C extends Page {

  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.refresh = this.refresh.bind(this);
    this.deleteInstance = this.deleteInstance.bind(this);
    this.startInstance = this.startInstance.bind(this);
    this.updateInstance = this.updateInstance.bind(this);
    this.stopInstance = this.stopInstance.bind(this);
    this.restartInstance = this.restartInstance.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `/${region.regionId}/instances`));

    this.setInterval(() => {
      this.refresh();
    }, 2000);
  }

  refresh() {
    const { dispatch, region, routerKey, params } = this.props;

    const instanceId = params.instanceId;
    dispatch(InstanceActions.requestDescribeInstance(routerKey, region.regionId, instanceId))
    .then(() => {
      this.instance = this.props.context.instance;
    });
  }

  isEnabled(instance) {
    return instance.status !== 'deleted' && instance.status !== 'ceased' && instance.status !== 'error';
  }

  isDeletable(instance) {
    return instance.status !== 'deleted' && instance.status !== 'ceased';
  }

  startInstance(e) {
    e.preventDefault();

    const { dispatch, region, routerKey, params } = this.props;
    dispatch(InstanceActions.requestStartInstances(routerKey, region.regionId, [params.instanceId]));
  }

  stopInstance(e) {
    e.preventDefault();

    const { dispatch, region, routerKey, params } = this.props;
    dispatch(InstanceActions.requestStopInstances(routerKey, region.regionId, [params.instanceId]));
  }

  onUpdate(values) {
    const { dispatch, region, routerKey } = this.props;
    const instance = this.props.context.instance || this.instance;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(InstanceActions.requestModifyInstanceAttributes(routerKey, region.regionId, instance.instanceId, name, description))
      .then(() => {
        resolve();
        this.refs.updateModal.hide();
      }).catch(() => {
        reject();
      });
    });
  }

  updateInstance(e) {
    e.preventDefault();
    this.refs.updateModal.show();
  }

  restartInstance(e) {
    e.preventDefault();

    const { dispatch, region, routerKey, params } = this.props;
    dispatch(InstanceActions.requestRestartInstances(routerKey, region.regionId, [params.instanceId]));
  }

  deleteInstance(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey, params } = this.props;

    confirmModal(t('confirmDelete'), () => {
      dispatch(InstanceActions.requestDeleteInstances(routerKey, region.regionId, [params.instanceId]));
    });
  }

  render() {
    const { t, region, params } = this.props;

    const instance = this.props.context.instance || this.instance;
    if (!instance || instance.instanceId !== params.instanceId) {
      this.refresh();

      return <div />;
    }

    let active = 'monitor';
    if (_.endsWith(this.props.location.pathname, 'console')) {
      active = 'console';
    } else if (_.endsWith(this.props.location.pathname, 'output')) {
      active = 'output';
    } else if (_.endsWith(this.props.location.pathname, 'monitor')) {
      active = 'monitor';
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                <i className="light">
                  {instance.instanceId}
                </i>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageInstance.basic')}
                    {this.isEnabled(instance) && <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a href onClick={this.updateInstance}>{t('pageInstance.updateInstance')}</a></li>
                        <li><a href onClick={this.startInstance}>{t('pageInstance.startInstance')}</a></li>
                        <li><a href onClick={this.stopInstance}>{t('pageInstance.stopInstance')}</a></li>
                        <li><a href onClick={this.restartInstance}>{t('pageInstance.restartInstance')}</a></li>
                        <li><a href onClick={this.deleteInstance}>{t('pageInstance.deleteInstance')}</a></li>
                      </ul>
                    </div>}
                    {!this.isEnabled(instance) && this.isDeletable(instance) && <div className="btn-group pull-right">
                      <button type="button" className="btn" onClick={this.deleteInstance}>
                        {t('pageInstance.deleteInstance')}
                      </button>
                    </div>}
                  </div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td>{instance.instanceId}</td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                        {instance.name && <strong>{instance.name}</strong>}
                        {!instance.name && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('description')}</td>
                        <td>
                        {instance.description && <strong>{instance.description}</strong>}
                        {!instance.description && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('address')}</td>
                        <td>
                        {instance.address && <strong>{instance.address}</strong>}
                        {!instance.address && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${instance.status}`}>
                          <i className="icon"></i>
                          {t(`instanceStatus.${instance.status}`)}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td>{instance.created}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {this.isEnabled(instance) && <div className="col-md-8 tabs">
                <ul className="nav-links clearfix">
                  <li className={`pull-left ${(active === 'monitor') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/monitor`}>
                      {t('pageInstance.monitor')}
                    </Link>
                  </li>
                  <li className={`pull-left ${(active === 'output') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/output`}>
                      {t('pageInstance.output')}
                    </Link>
                  </li>
                  <li className={`pull-left ${(active === 'console') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`/${region.regionId}/instances/${instance.instanceId}/console`}>
                      {t('pageInstance.console')}
                    </Link>
                  </li>
                </ul>
                <div>
                  {React.cloneElement(this.props.children, { instance })}
                </div>
              </div>}
            </div>
          </div>
        </div>
        <Modal title={t('pageInstance.updateInstance')} ref="updateModal" >
          <InstanceUpdateForm onSubmit={this.onUpdate} initialValues={instance} />
        </Modal>
      </div>
    );
  }
}

export default attach(C);
