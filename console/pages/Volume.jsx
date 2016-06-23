import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Time from 'react-time';
import Page, { attach } from '../../shared/pages/Page';
import Modal, { confirmModal } from '../../shared/components/Modal';
import * as Actions from '../redux/actions';
import * as VolumeActions from '../redux/actions.volume';
import * as InstanceActions from '../redux/actions.instance';
import * as Validations from '../../shared/utils/validations';

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
    { name, instanceId, mountpoint },
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
            <input type="text" className="form-control" disabled {...name} />
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
        <div className={submitFailed && mountpoint.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('mountpoint')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...mountpoint} />
            {submitFailed && mountpoint.error && <div className="text-danger"><small>{mountpoint.error}</small></div>}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
        <button type="submit" className="btn btn-save" disabled={submitting || invalid}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('submit')}
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

VolumeAttachForm.validate = (values) => {
  const errors = {};
  errors.mountpoint = Validations.required(values.mountpoint);
  return errors;
};

VolumeAttachForm = reduxForm({
  form: 'VolumeAttachForm',
  fields: ['name', 'instanceId', 'mountpoint'],
  validate: VolumeAttachForm.validate,
})(translate()(VolumeAttachForm));

let VolumeResizeForm = (props) => {
  const { fields:
    { name, size },
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
            <input type="text" className="form-control" disabled {...name} />
            {submitFailed && name.error && <div className="text-danger"><small>{name.error}</small></div>}
          </div>
        </div>
        <div className={submitFailed && size.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('size')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...size} />
            {submitFailed && size.error && <div className="text-danger"><small>{size.error}</small></div>}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
        <button type="submit" className="btn btn-save" disabled={submitting || invalid}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('submit')}
        </button>
      </div>
    </form>
  );
};

VolumeResizeForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  availableInstances: React.PropTypes.array,
  t: React.PropTypes.any,
};

VolumeResizeForm.validate = (values) => {
  const errors = {};
  errors.size = Validations.integer(values.size);
  return errors;
};

VolumeResizeForm = reduxForm({
  form: 'VolumeResizeForm',
  fields: ['name', 'size'],
  validate: VolumeResizeForm.validate,
})(translate()(VolumeResizeForm));

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
    this.onAttach = this.onAttach.bind(this);
    this.onResize = this.onResize.bind(this);
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

  onAttach(values) {
    const { dispatch, region, routerKey } = this.props;
    const volume = this.props.context.volume || this.volume;

    return new Promise((resolve, reject) => {
      const instanceId = values.instanceId;
      const mountpoint = values.mountpoint;

      dispatch(VolumeActions.requestAttachVolume(routerKey, region.regionId, volume.volumeId, instanceId, mountpoint, 'rw'))
        .then(() => {
          resolve();
          this.refs.attachModal.hide();
        }).catch(() => {
          reject();
        });
    });
  }

  attachVolume(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey } = this.props;

    dispatch(InstanceActions.requestDescribeInstances(routerKey, region.regionId, { status: ['active', 'stopped'] }))
      .then(() => {
        if (this.props.context.instanceSet && this.props.context.instanceSet.length) {
          this.refs.attachModal.show();
        } else {
          dispatch(Actions.notifyAlert(t('pageVolume.noAvailableInstance')));
        }
      });
  }

  detachVolume(e) {
    e.preventDefault();
    const { t, dispatch, region, routerKey } = this.props;
    const volume = this.props.context.volume;
    confirmModal(t('pageVolume.confirmDetachVolume'), () => {
      dispatch(VolumeActions.requestDetachVolumes(routerKey, region.regionId, [volume.volumeId], 'i-VVyfG7jk'))
        .then(() => {
          dispatch(VolumeActions.requestDescribeVolume(routerKey, region.regionId, volume.volumeId));
        });
    });
  }

  onResize(values) {
    const { dispatch, region, routerKey } = this.props;
    const volume = this.props.context.volume || this.volume;

    return new Promise((resolve, reject) => {
      const size = Number(values.size);

      dispatch(VolumeActions.requestResizeVolumes(routerKey, region.regionId, [volume.volumeId], size))
        .then(() => {
          resolve();
          this.refs.resizeModal.hide();
          dispatch(VolumeActions.requestDescribeVolume(routerKey, region.regionId, volume.volumeId));
        }).catch(() => {
          reject();
        });
    });
  }

  resizeVolume(e) {
    e.preventDefault();
    this.refs.resizeModal.show();
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
      name: this.props.context.volume.name,
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
                        <td><Time value={volume.created} format="YYYY-MM-DD" /></td>
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
        <Modal title={t('pageVolume.resizeVolume')} ref="resizeModal" >
          <VolumeResizeForm onSubmit={this.onResize} initialValues={volume} />
        </Modal>
        {this.props.context.instanceSet && this.props.context.instanceSet.length && this.renderAttachModal()}
      </div>
    );
  }
}

export default attach(C);
