import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Time from 'react-time';
import Modal, { confirmModal } from '../../shared/components/Modal';
import EipMonitor from './EipMonitor';
import * as Actions from '../../console-common/redux/actions';
import * as EipActions from '../redux/actions.eip';
import * as InstanceActions from '../redux/actions.instance';
import * as Validations from '../../shared/utils/validations';

let EipUpdateForm = (props) => {
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

EipUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

EipUpdateForm.validate = () => {
  const errors = {};
  return errors;
};

EipUpdateForm = reduxForm({
  form: 'EipUpdateForm',
  fields: ['name'],
  validate: EipUpdateForm.validate,
})(translate()(EipUpdateForm));

let EipAssociateForm = (props) => {
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

EipAssociateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  availableInstances: React.PropTypes.array,
  t: React.PropTypes.any,
};

EipAssociateForm.validate = () => {
  const errors = {};
  return errors;
};

EipAssociateForm = reduxForm({
  form: 'EipAssociateForm',
  fields: ['name', 'instanceId'],
  validate: EipAssociateForm.validate,
})(translate()(EipAssociateForm));

class BandwidthUpdateForm extends React.Component {

  componentDidMount() {
    this.props.initializeForm({ name: this.props.eip.name });
  }

  render() {
    const { fields:
      { name, bandwidth },
      handleSubmit,
      submitting,
      submitFailed,
      t,
      invalid,
    } = this.props;
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
          <div className={submitFailed && bandwidth.error ? 'form-group has-error' : 'form-group'}>
            <label className="control-label" >{t('bandwidth')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" {...bandwidth} />
              {submitFailed && bandwidth.error && <div className="text-danger"><small>{bandwidth.error}</small></div>}
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
  }
}


BandwidthUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  eip: React.PropTypes.object.isRequired,
  t: React.PropTypes.any,
};

BandwidthUpdateForm.validate = (values) => {
  const errors = {};
  errors.bandwidth = Validations.integer(values.bandwidth);
  return errors;
};

BandwidthUpdateForm = reduxForm({
  form: 'BandwidthUpdateForm',
  fields: ['name', 'bandwidth'],
  validate: BandwidthUpdateForm.validate,
})(translate()(BandwidthUpdateForm));

class C extends Page {

  constructor(props) {
    super(props);

    this.updateEip = this.updateEip.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onAssociate = this.onAssociate.bind(this);
    this.associateEip = this.associateEip.bind(this);
    this.dissociateEip = this.dissociateEip.bind(this);
    this.updateBandwidth = this.updateBandwidth.bind(this);
    this.onUpdateBandwidth = this.onUpdateBandwidth.bind(this);
    this.deleteEip = this.deleteEip.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('eipManage'), `${servicePath}/eips`));

    this.setInterval(() => {
      this.refresh();
    }, 2000);
  }

  refresh() {
    const { dispatch, region, routerKey, params } = this.props;

    const eipId = params.eipId;
    dispatch(EipActions.requestDescribeEip(routerKey, region.regionId, eipId))
    .then(() => {
      this.eip = this.props.context.eip;
    });
  }

  isEnabled(eip) {
    return eip.status !== 'deleted' && eip.status !== 'ceased';
  }

  isDeletable(eip) {
    return eip.status !== 'deleted' && eip.status !== 'ceased' && eip.status !== 'associated';
  }

  onUpdate(values) {
    const { dispatch, region, routerKey } = this.props;
    const eip = this.props.context.eip || this.eip;

    return new Promise((resolve, reject) => {
      const name = values.name;

      dispatch(EipActions.requestModifyEipAttributes(routerKey, region.regionId, eip.eipId, name))
      .then(() => {
        resolve();
        this.refs.updateModal.hide();
      }).catch(() => {
        reject();
      });
    });
  }

  updateEip(e) {
    e.preventDefault();

    this.refs.updateModal.show();
  }

  onAssociate(values) {
    const { t, dispatch, region, routerKey } = this.props;
    const eip = this.props.context.eip || this.eip;

    return new Promise((resolve, reject) => {
      const instanceId = values.instanceId;

      dispatch(EipActions.requestAssociateEip(routerKey, region.regionId, eip.eipId, instanceId))
        .then(() => {
          resolve();
          this.refs.associateModal.hide();
        }).catch((error) => {
          this.refs.associateModal.hide();
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

    dispatch(InstanceActions.requestDescribeInstances(routerKey, region.regionId, { status: ['active', 'stopped'] }))
      .then(() => {
        if (this.props.context.instanceSet && this.props.context.instanceSet.length) {
          const availableInstances = this.props.context.instanceSet.filter((instance) => {
            return !instance.eip;
          });
          if (availableInstances.length) {
            dispatch(Actions.extendContext({ availableInstances }, routerKey));
            this.refs.associateModal.show();
          } else {
            dispatch(Actions.notifyAlert(t('pageEip.noAvailableInstance')));
          }
        } else {
          dispatch(Actions.notifyAlert(t('pageEip.noAvailableInstance')));
        }
      });
  }

  dissociateEip(e) {
    e.preventDefault();
    const { t, dispatch, region, routerKey } = this.props;
    const eip = this.props.context.eip;

    confirmModal(t('pageEip.confirmDissociateEip'), () => {
      dispatch(EipActions.requestDissociateEips(routerKey, region.regionId, [eip.eipId]))
        .then(() => {
          dispatch(EipActions.requestDescribeEip(routerKey, region.regionId, eip.eipId));
        });
    });
  }

  deleteEip(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey, params } = this.props;

    confirmModal(t('confirmDelete'), () => {
      dispatch(EipActions.requestReleaseEips(routerKey, region.regionId, [params.eipId]));
    });
  }

  onUpdateBandwidth(values) {
    const { dispatch, region, routerKey } = this.props;
    const eip = this.props.context.eip;

    return new Promise((resolve, reject) => {
      const bandwidth = Number(values.bandwidth);

      dispatch(EipActions.requestUpdateBandwidth(routerKey, region.regionId, [eip.eipId], bandwidth))
        .then(() => {
          resolve();
          this.refs.bandwidthUpdateModal.hide();
        }).catch(() => {
          reject();
        });
    });
  }

  updateBandwidth(e) {
    e.preventDefault();

    this.refs.bandwidthUpdateModal.show();
  }

  renderAssociateModal() {
    const { t } = this.props;
    const availableInstances = this.props.context.availableInstances;
    const initialValues = {
      instanceId: availableInstances[0].instanceId,
      name: this.props.context.eip.name,
    };
    return (
      <Modal title={t('pageEip.associateEip')} ref="associateModal" >
        <EipAssociateForm onSubmit={this.onAssociate} availableInstances={availableInstances} initialValues={initialValues} />
      </Modal>
    );
  }

  render() {
    const { t, params } = this.props;

    const eip = this.props.context.eip || this.eip;

    if (!eip || eip.eipId !== params.eipId) {
      this.refresh();

      return <div />;
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">
            <div className="top-area">
              <div className="nav-text">
                <span>{t('eip')}&nbsp;<i>{eip.eipId}</i></span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageEip.basic')}
                    {this.isEnabled(eip) && <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={['active', 'associated'].indexOf(eip.status) === -1}
                            onClick={this.updateEip}
                          >
                            {t('pageEip.updateEip')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={eip.status !== 'active'}
                            onClick={this.associateEip}
                          >
                            {t('pageEip.associateResource')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={eip.status !== 'associated'}
                            onClick={this.dissociateEip}
                          >
                            {t('pageEip.dissociateResource')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={eip.status !== 'active'}
                            onClick={this.updateBandwidth}
                          >
                            {t('pageEip.updateBandwidth')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="btn-page-action"
                            disabled={['active', 'error'].indexOf(eip.status) === -1}
                            onClick={this.deleteEip}
                          >
                            {t('pageEip.deleteEip')}
                          </button>
                        </li>
                      </ul>
                    </div>}
                  </div>
                  <table className="table table-detail">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td><span>{eip.eipId}</span></td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                          <span>
                          {eip.name && <strong>{eip.name}</strong>}
                          {!eip.name && <i className="text-muted">{t('noName')}</i>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('bandwidth')}</td>
                        <td><span>{eip.bandwidth}Mb</span></td>
                      </tr>
                      <tr>
                        <td>{t('associateResource')}</td>
                        <td>
                          <span>{eip.resourceId || <i className="text-muted">{t('noName')}</i>}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('ip')}</td>
                        <td><span>{eip.address}</span></td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${eip.status}`}>
                          <span>
                            <i className="icon"></i>
                            {t(`eipStatus.${eip.status}`)}
                            <br />
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td><span><Time value={eip.created} format="YYYY-MM-DD HH:mm:ss" /></span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-8">
                <EipMonitor eip={eip} />
              </div>
            </div>
          </div>
        </div>
        <Modal title={t('pageEip.updateEip')} ref="updateModal" >
          <EipUpdateForm onSubmit={this.onUpdate} initialValues={eip} />
        </Modal>
        <Modal title={t('pageEip.updateBandwidth')} ref="bandwidthUpdateModal" >
          <BandwidthUpdateForm onSubmit={this.onUpdateBandwidth} eip={eip} />
        </Modal>
        {this.props.context.availableInstances && this.props.context.availableInstances.length && this.renderAssociateModal()}
      </div>
    );
  }

}

export default attach(C);
