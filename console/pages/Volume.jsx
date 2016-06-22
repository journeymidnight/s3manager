import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Page, { attach } from '../../shared/pages/Page';
import Modal, { confirmModal } from '../../shared/components/Modal';
import * as Actions from '../redux/actions';
import * as VolumeActions from '../redux/actions.volume';
import * as InstanceActions from '../redux/actions.instance';

let VolumeUpdateForm = (props) => {
  const { fields:
    { name },
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

VolumeUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

VolumeUpdateForm.validate = () => {
  const errors = {};
  return errors;
};

VolumeUpdateForm = reduxForm({
  form: 'VolumeUpdateForm',
  fields: ['name'],
  validate: VolumeUpdateForm.validate,
})(translate()(VolumeUpdateForm));

let VolumeAttachForm = (props) => {
  const { fields:
    { name, instanceId },
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
        <div className={submitFailed && instanceId.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('instance')}</label>
          <div className="col-sm-10">
            <select className="form-control" {...instanceId}>
              {props.availableInstances.map((instance) => {
                return <option key={instance.instanceId} value={instance.instanceId}>{instance.name}</option>;
              })}
            </select>
            {submitFailed && instanceId.error && <div className="text-danger"><small>{instanceId.error}</small></div>}
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

VolumeAttachForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  availableInstances: React.PropTypes.array,
  t: React.PropTypes.any,
};

VolumeAttachForm.validate = () => {
  const errors = {};
  return errors;
};

VolumeAttachForm = reduxForm({
  form: 'VolumeAttachForm',
  fields: ['name', 'instanceId'],
  validate: VolumeAttachForm.validate,
})(translate()(VolumeAttachForm));

class C extends Page {

  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.refresh = this.refresh.bind(this);
    this.updateVolume = this.updateVolume.bind(this);
    this.attachVolume = this.attachVolume.bind(this);
    this.detachVolume = this.detachVolume.bind(this);
    this.resizeVolume = this.resizeVolume.bind(this);
    this.deleteVolume = this.deleteVolume.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('volumeManage'), `/${region.regionId}/volumes`));

    this.setInterval(() => {
      this.refresh();
    }, 2000);
  }

  refresh() {
    const { dispatch, region, routerKey, params } = this.props;

    const volumeId = params.volumeId;
    dispatch(VolumeActions.requestDescribeVolume(routerKey, region.regionId, volumeId))
    .then(() => {
      this.volume = this.props.context.volume;
    });
  }

  isEnabled(volume) {
    return volume.status !== 'deleted' && volume.status !== 'ceased' && volume.status !== 'error';
  }

  isDeletable(volume) {
    return volume.status !== 'deleted' && volume.status !== 'ceased';
  }

  onUpdate(values) {
    const { dispatch, region, routerKey } = this.props;
    const volume = this.props.context.volume || this.volume;

    return new Promise((resolve, reject) => {
      const name = values.name;

      dispatch(VolumeActions.requestModifyVolumeAttributes(routerKey, region.regionId, volume.volumeId, name))
      .then(() => {
        resolve();
        this.refs.updateModal.hide();
      }).catch(() => {
        reject();
      });
    });
  }

  updateVolume(e) {
    e.preventDefault();
    this.refs.updateModal.show();
  }

  attachVolume(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey } = this.props;

    dispatch(InstanceActions.requestDescribeInstances(routerKey, region.regionId, { status: ['running', 'stopped'] }))
      .then(() => {
        if (this.props.context.instanceSet && this.props.context.instanceSet.length) {
          this.refs.attachModal.show();
        } else {
          dispatch(Actions.notifyAlert(t('noAvailableInstance')));
        }
      });
  }

  detachVolume(e) {
    e.preventDefault();
    this.refs.updateModal.show();
  }

  resizeVolume(e) {
    e.preventDefault();
    this.refs.updateModal.show();
  }

  deleteVolume(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey, params } = this.props;

    confirmModal(t('confirmDelete'), () => {
      dispatch(VolumeActions.requestDeleteVolumes(routerKey, region.regionId, [params.volumeId]));
    });
  }

  renderAttachModal() {
    const { t } = this.props;
    const availableInstances = this.props.context.instanceSet;
    const initialValues = {
      instanceId: availableInstances[0].instanceId,
    };
    return (
      <Modal title={t('pageVolume.attachVolume')} ref="attachModal" >
        <VolumeAttachForm onSubmit={this.onAttach} availableInstances={availableInstances} initialValues={initialValues} />
      </Modal>
    );
  }

  render() {
    const { t, params } = this.props;

    const volume = this.props.context.volume || this.volume;

    if (!volume || volume.volumeId !== params.volumeId) {
      this.refresh();

      return <div />;
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">
            <div className="top-area">
              <div className="nav-text">
                <i className="light">
                  {volume.volumeId}
                </i>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageVolume.basic')}
                    {this.isEnabled(volume) && <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a href onClick={this.updateVolume}>{t('pageVolume.updateVolume')}</a></li>
                        <li><a href onClick={this.attachVolume}>{t('pageVolume.attachVolume')}</a></li>
                        <li><a href onClick={this.detachVolume}>{t('pageVolume.detachVolume')}</a></li>
                        <li><a href onClick={this.resizeVolume}>{t('pageVolume.resizeVolume')}</a></li>
                        <li><a href onClick={this.deleteVolume}>{t('pageVolume.deleteVolume')}</a></li>
                      </ul>
                    </div>}
                    {!this.isEnabled(volume) && this.isDeletable(volume) && <div className="btn-group pull-right">
                      <button type="button" className="btn" onClick={this.deleteVolume}>
                        {t('pageVolume.deleteVolume')}
                      </button>
                    </div>}
                  </div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td>{volume.volumeId}</td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                        {volume.name && <strong>{volume.name}</strong>}
                        {!volume.name && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('size')}</td>
                        <td>
                        {volume.size && <strong>{volume.size}</strong>}
                        {!volume.size && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${volume.status}`}>
                          <i className="icon"></i>
                          {t(`volumeStatus.${volume.status}`)}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td>{volume.created}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal title={t('pageVolume.updateVolume')} ref="updateModal" >
          <VolumeUpdateForm onSubmit={this.onUpdate} initialValues={volume} />
        </Modal>
        {this.props.context.volumeSet && this.props.context.volumeSet.length && this.renderAttachModal()}
      </div>
    );
  }
}

export default attach(C);
