import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import Modal, { alertModal, confirmModal } from '../../shared/components/Modal';
import InstanceResetForm from '../forms/InstanceResetForm';
import InstanceRestartForm from '../forms/InstanceRestartForm';
import InstanceResizeForm from '../forms/InstanceResizeForm';
import InstanceEipForm from '../forms/InstanceEipForm';
import InstanceCaptureForm from '../forms/InstanceCaptureForm';
import InstanceVolumeForm from '../forms/InstanceVolumeForm';
import * as EipActions from '../redux/actions.eip';
import * as Actions from '../../console-common/redux/actions';
import * as InstanceActions from '../redux/actions.instance';
import * as VolumeActions from '../redux/actions.volume';
import * as Validations from '../../shared/utils/validations';

let InstanceUpdateForm = (props) => {
  const { fields:
    { name, description },
    handleSubmit,
    submitting,
    submitFailed,
    t,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">

        <div className={(submitFailed || name.touched) && name.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('name')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...name} maxLength="50" />
            {(submitFailed || name.touched) && name.error && <div className="text-danger"><small>{name.error}</small></div>}
          </div>
        </div>

        <div className={(submitFailed || description.touched) && description.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('description')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...description} maxLength="250" />
            {(submitFailed || description.touched) && description.error && <div className="text-danger"><small>{description.error}</small></div>}
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
};

InstanceUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

InstanceUpdateForm.validate = (values) => {
  const errors = {};
  errors.name = Validations.hostname(values.name);
  return errors;
};

InstanceUpdateForm = reduxForm({
  form: 'InstanceUpdateForm',
  fields: ['name', 'description'],
  validate: InstanceUpdateForm.validate,
})(translate()(InstanceUpdateForm));

class C extends Page {

  constructor(props) {
    super(props);

    this.onCaptureInstance = this.onCaptureInstance.bind(this);
    this.onAssociateEip = this.onAssociateEip.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onRestart = this.onRestart.bind(this);
    this.onChangeLogin = this.onChangeLogin.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onAttachVolume = this.onAttachVolume.bind(this);
    this.refresh = this.refresh.bind(this);
    this.deleteInstance = this.deleteInstance.bind(this);
    this.startInstance = this.startInstance.bind(this);
    this.updateInstance = this.updateInstance.bind(this);
    this.stopInstance = this.stopInstance.bind(this);
    this.restartInstance = this.restartInstance.bind(this);
    this.resizeInstance = this.resizeInstance.bind(this);
    this.resetInstance = this.resetInstance.bind(this);
    this.changeLoginInstance = this.changeLoginInstance.bind(this);
    this.connectVNC = this.connectVNC.bind(this);
    this.associateEip = this.associateEip.bind(this);
    this.dissociateEip = this.dissociateEip.bind(this);
    this.captureInstance = this.captureInstance.bind(this);
    this.attachVolume = this.attachVolume.bind(this);
    this.noKeypairHandler = this.noKeypairHandler.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('instanceManage'), `${servicePath}/instances`));

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

    const { t, dispatch, region, routerKey, params } = this.props;

    confirmModal(t('confirmStop'), () => {
      dispatch(InstanceActions.requestStopInstances(routerKey, region.regionId, [params.instanceId]));
    });
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

    this.refs.restartModal.show();
  }

  onRestart(values) {
    const { dispatch, region, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      const restartType = values.restartType;

      dispatch(InstanceActions.requestRestartInstances(routerKey, region.regionId, [params.instanceId], restartType))
      .then(() => {
        resolve();
        this.refs.restartModal.hide();
      }).catch(() => {
        reject();
      });
    });
  }

  deleteInstance(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey, params } = this.props;

    confirmModal(t('confirmDelete'), () => {
      dispatch(InstanceActions.requestDeleteInstances(routerKey, region.regionId, [params.instanceId]))
        .then(() => {
          dispatch(Actions.notify(t('deleteSuccessed')));
        });
    });
  }

  onReset(values) {
    const { dispatch, region, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      const loginMode = values.loginMode;
      const loginPassword = values.loginPassword;
      const keyPairId = values.keyPairId;

      dispatch(InstanceActions.requestResetInstances(routerKey, region.regionId, [params.instanceId], loginMode, loginPassword, keyPairId))
      .then(() => {
        resolve();
        this.refs.resetModal.hide();
      }).catch(() => {
        reject();
      });
    });
  }

  resetInstance(e) {
    e.preventDefault();

    this.refs.resetModal.show();
  }

  onChangeLogin(values) {
    const { dispatch, region, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      const loginMode = values.loginMode;
      const loginPassword = values.loginPassword;
      const keyPairId = values.keyPairId;

      dispatch(InstanceActions.requestChangeLoginInstances(routerKey, region.regionId, params.instanceId, loginMode, loginPassword, keyPairId))
      .then(() => {
        resolve();
        this.refs.changeLoginModal.hide();
      }).catch(() => {
        reject();
      });
    });
  }

  changeLoginInstance(e) {
    e.preventDefault();

    this.refs.changeLoginModal.show();
  }

  onAssociateEip(values) {
    const { t, dispatch, region, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      const eipId = values.eipId;

      dispatch(EipActions.requestAssociateEip(routerKey, region.regionId, eipId, params.instanceId))
        .then(() => {
          resolve();
          this.refs.eipModal.hide();
        }).catch((error) => {
          this.refs.eipModal.hide();
          if (error.retCode === 4701) {
            dispatch(Actions.notifyAlert(t('errorMsg.4701')));
          } else {
            dispatch(Actions.notifyAlert(error.message));
          }
          reject();
        });
    });
  }

  associateEip(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey } = this.props;

    dispatch(EipActions.requestDescribeEips(routerKey, region.regionId, { status: ['active'], limit: 100 }))
      .then(() => {
        if (this.props.context.eipSet && this.props.context.eipSet.length) {
          this.refs.eipModal.show();
        } else {
          alertModal(t('pageInstance.noEipToBeAssociated'));
        }
      });
  }

  dissociateEip(e) {
    e.preventDefault();

    const { dispatch, region, routerKey, params, t } = this.props;
    const instance = this.props.context.instance || this.instance;
    confirmModal(t('pageEip.confirmDissociateEip'), () => {
      dispatch(EipActions.requestDissociateEips(routerKey, region.regionId, [instance.eipId], params.instanceId))
        .then(() => {
        }).catch(() => {
        });
    });
  }

  onCaptureInstance(values) {
    const { dispatch, region, routerKey, params, servicePath } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;

      dispatch(InstanceActions.requestCaptureInstance(routerKey, region.regionId, params.instanceId, name))
      .then(() => {
        resolve();
        this.refs.captureModal.hide();
        dispatch(push(`${servicePath}/images_snapshots/private_images`));
      }).catch((error) => {
        dispatch(Actions.notifyAlert(error.displayMsg || error.message));
        reject();
      });
    });
  }

  captureInstance(e) {
    e.preventDefault();

    this.refs.captureModal.show();
  }

  onResize(values) {
    const { dispatch, region, routerKey, params } = this.props;

    return new Promise((resolve, reject) => {
      const instanceTypeId = values.instanceTypeId;

      dispatch(InstanceActions.requestResizeInstances(routerKey, region.regionId, [params.instanceId], instanceTypeId))
      .then(() => {
        resolve();
        this.refs.resizeModal.hide();
      }).catch((error) => {
        dispatch(Actions.notifyAlert(error.displayMsg || error.message));
        reject();
      });
    });
  }

  resizeInstance(e) {
    e.preventDefault();

    this.refs.resizeModal.show();
  }

  attachVolume(e) {
    e.preventDefault();

    const { t, dispatch, routerKey, region } = this.props;

    dispatch(VolumeActions.requestDescribeVolumes(routerKey, region.regionId, { status: ['active'], limit: 100 }))
      .then(() => {
        if (this.props.context.volumeSet && this.props.context.volumeSet.length) {
          this.refs.attachVolumeModal.show();
        } else {
          alertModal(t('pageInstance.noVolumeToBeAttahed'));
        }
      });
  }

  onAttachVolume(values) {
    const { dispatch, region, routerKey } = this.props;

    const volumeId = values.volumeId;
    const instanceId = this.props.context.instance.instanceId;
    return new Promise((resolve, reject) => {
      dispatch(VolumeActions.requestAttachVolume(routerKey, region.regionId, volumeId, instanceId))
        .then(() => {
          this.refs.attachVolumeModal.hide();
          resolve();
        }).catch(() => {
          reject();
        });
    });
  }

  renderAttachVolumeModal() {
    const { t } = this.props;
    const availableVolumes = this.props.context.volumeSet;
    const initialValues = {
      volumeId: availableVolumes[0].volumeId,
    };
    return (
      <Modal title={t('pageInstance.attachVolume')} ref="attachVolumeModal" >
        <InstanceVolumeForm onSubmit={this.onAttachVolume} availableVolumes={availableVolumes} initialValues={initialValues} />
      </Modal>
    );
  }

  renderAssociateEipModal() {
    const { t } = this.props;
    const availableEips = this.props.context.eipSet;
    const initialValues = {
      eipId: availableEips[0].eipId,
    };
    return (
      <Modal title={t('pageInstance.associateEip')} ref="eipModal" >
        <InstanceEipForm onSubmit={this.onAssociateEip} availableEips={availableEips} initialValues={initialValues} />
      </Modal>
    );
  }

  noKeypairHandler(e) {
    e.preventDefault();
    const { dispatch, servicePath } = this.props;
    this.refs.resetModal.hide();
    dispatch(push(`${servicePath}/key_pairs/create`));
  }

  connectVNC(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey, params } = this.props;
    const instance = this.props.context.instance;

    if (instance.status !== 'active') {
      alertModal(t('promptOperationCheck.promptPrefix1') + t('pageInstance.connectVNC'));
      return;
    }
    dispatch(InstanceActions.requestConnectVNC(routerKey, region.regionId, params.instanceId));
  }

  render() {
    const { t, servicePath, region, params } = this.props;

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
                <span>{t('instance')}&nbsp;<i>{instance.instanceId}</i></span>
              </div>
              <div className="nav-controls">
                {instance.status === 'active' && <a className="btn btn-info pull-right" href onClick={this.connectVNC}>
                  <i className="fa fa-desktop"></i>&nbsp;{t('pageInstance.connectVNC')}
                </a>}
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
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={['active', 'stopped'].indexOf(instance.status) === -1}
                            onClick={this.updateInstance}
                          >
                            {t('pageInstance.updateInstance')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={instance.status !== 'stopped'}
                            onClick={this.startInstance}
                          >
                            {t('pageInstance.startInstance')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={instance.status !== 'active'}
                            onClick={this.stopInstance}
                          >
                            {t('pageInstance.stopInstance')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={instance.status !== 'active'}
                            onClick={this.restartInstance}
                          >
                            {t('pageInstance.restartInstance')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={['active', 'stopped', 'error'].indexOf(instance.status) === -1}
                            onClick={this.deleteInstance}
                          >
                            {t('pageInstance.deleteInstance')}
                          </button>
                        </li>
                      </ul>
                    </div>}
                    {!this.isEnabled(instance) && this.isDeletable(instance) && <div className="btn-group pull-right">
                      <button type="button" className="btn" onClick={this.deleteInstance}>
                        {t('pageInstance.deleteInstance')}
                      </button>
                    </div>}
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td width="100">{t('id')}</td>
                        <td>
                          <span>{instance.instanceId}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                          <span>
                          {instance.name && <strong>{instance.name}</strong>}
                          {!instance.name && <i className="text-muted">{t('noName')}</i>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('description')}</td>
                        <td>
                          <span>
                          {instance.description && <span>{instance.description}</span>}
                          {!instance.description && <i className="text-muted">{t('noName')}</i>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${instance.status}`}>
                          <span>
                            <i className="icon"></i>
                            {t(`instanceStatus.${instance.status}`)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td><span>{moment.utc(instance.created).local().format('YYYY-MM-DD HH:mm:ss')}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageInstance.configuration')}
                    {this.isEnabled(instance) && <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={instance.status !== 'stopped'}
                            onClick={this.resizeInstance}
                          >
                            {t('pageInstance.resizeInstance')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={['active', 'stopped'].indexOf(instance.status) === -1}
                            onClick={this.attachVolume}
                          >
                            {t('pageInstance.attachVolume')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={instance.status !== 'active'}
                            onClick={this.changeLoginInstance}
                          >
                            {t('pageInstance.changeLoginInstance')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={instance.status !== 'stopped'}
                            onClick={this.resetInstance}
                          >
                            {t('pageInstance.resetInstance')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={['active', 'stopped'].indexOf(instance.status) === -1 || instance.eip}
                            onClick={this.associateEip}
                          >
                            {t('pageInstance.associateEip')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={['active', 'stopped'].indexOf(instance.status) === -1 || !instance.eip}
                            onClick={this.dissociateEip}
                          >
                            {t('pageInstance.dissociateEip')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={['active', 'stopped'].indexOf(instance.status) === -1}
                            onClick={this.captureInstance}
                          >
                            {t('pageInstance.captureInstance')}
                          </button>
                        </li>
                      </ul>
                    </div>}
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td>{t('image')}</td>
                        <td>
                          <span>{instance.image.name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('vcpus')}</td>
                        <td>
                          <span>{instance.currentVCPUs}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('memory')}</td>
                        <td>
                          <span>{instance.currentMemory} MB</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('disk')}</td>
                        <td>
                          <span>{instance.currentDisk} GB</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('volume')}</td>
                        <td>
                          <span>
                          {!!instance.volumes.length && instance.volumes.map((volume) => {
                            return (<div>
                              <Link to={`${servicePath}/volumes/${volume.volumeId}`}>
                                {volume.volumeId} ({volume.size}GB)
                              </Link>
                            </div>);
                          })}
                          {!instance.volumes.length && <i className="text-muted">{t('noName')}</i>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('network')}</td>
                        <td>
                          <span>
                          {instance.networkId && <Link to={`${servicePath}/networks/${instance.networkId}`}>
                            {instance.networkId}
                          </Link>}
                          {!instance.networkId && <i className="text-muted">{t('noName')}</i>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('privateIP')}</td>
                        <td>
                          <span>
                            {instance.address && <span>{instance.address}</span>}
                            {!instance.address && <i className="text-muted">{t('noName')}</i>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('publicIP')}</td>
                        <td>
                          <span>
                          {instance.eip && <Link to={`${servicePath}/eips/${instance.eip.eipId}`}>
                            {instance.eip.eipId} ({instance.eip.address})
                          </Link>}
                          {!instance.eip && <i className="text-muted">{t('noName')}</i>}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
              {this.isEnabled(instance) && <div className="col-md-8 tabs">
                <ul className="nav-links clearfix">
                  <li className={`pull-left ${(active === 'monitor') ? 'active' : ''}`}>
                    <Link data-placement="left" to={`${servicePath}/instances/${instance.instanceId}/monitor`}>
                      {t('pageInstance.monitor')}
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
        <Modal title={t('pageInstance.resetInstance')} ref="resetModal" >
          <InstanceResetForm onSubmit={this.onReset} instance={instance} region={region} onNoKeypairHandler={this.noKeypairHandler} />
        </Modal>
        <Modal title={t('pageInstance.changeLoginInstance')} ref="changeLoginModal" >
          <InstanceResetForm onSubmit={this.onChangeLogin} instance={instance} region={region} onNoKeypairHandler={this.noKeypairHandler} />
        </Modal>
        <Modal title={t('pageInstance.resizeInstance')} ref="resizeModal" >
          <InstanceResizeForm onSubmit={this.onResize} instance={instance} region={region} />
        </Modal>
        {this.props.context.eipSet && this.props.context.eipSet.length && this.renderAssociateEipModal()}
        <Modal title={t('pageInstance.captureInstance')} ref="captureModal" >
          <InstanceCaptureForm onSubmit={this.onCaptureInstance} instance={instance} region={region} />
        </Modal>
        {this.props.context.volumeSet && this.props.context.volumeSet.length && this.renderAttachVolumeModal()}
        <Modal title={t('confirmRestart')} ref="restartModal" >
          <InstanceRestartForm onSubmit={this.onRestart} />
        </Modal>
      </div>
    );
  }
}

export default attach(C);
