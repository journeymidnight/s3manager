import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Time from 'react-time';
import Modal, { confirmModal } from '../../shared/components/Modal';
import EipMonitor from './EipMonitor';
import * as Actions from '../redux/actions';
import * as EipActions from '../redux/actions.eip';
import * as InstanceActions from '../redux/actions.instance';

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

class C extends Page {

  constructor(props) {
    super(props);

    this.updateEip = this.updateEip.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onAssociate = this.onAssociate.bind(this);
    this.associateEip = this.associateEip.bind(this);
    this.dissociateEip = this.dissociateEip.bind(this);
    this.deleteEip = this.deleteEip.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('eipManage'), `/${region.regionId}/eips`));

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
    const { dispatch, region, routerKey } = this.props;
    const eip = this.props.context.eip || this.eip;

    return new Promise((resolve, reject) => {
      const instanceId = values.instanceId;

      dispatch(EipActions.requestAssociateEip(routerKey, region.regionId, eip.eipId, instanceId))
        .then(() => {
          resolve();
          this.refs.associateModal.hide();
        }).catch(() => {
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
      dispatch(EipActions.requestDissociateEips(routerKey, region.regionId, [eip.eipId], 'i-VVyfG7jk'))
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
                <i className="light">
                  {eip.eipId}
                </i>
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
                        <li><a href onClick={this.updateEip}>{t('pageEip.updateEip')}</a></li>
                        <li><a href onClick={this.associateEip}>{t('pageEip.associateEip')}</a></li>
                        <li><a href onClick={this.dissociateEip}>{t('pageEip.dissociateEip')}</a></li>
                        <li><a href onClick={this.deleteEip}>{t('pageEip.deleteEip')}</a></li>
                      </ul>
                    </div>}
                  </div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td>{eip.eipId}</td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                        {eip.name && <strong>{eip.name}</strong>}
                        {!eip.name && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('bandwidth')}</td>
                        <td>{eip.bandwidth}Mb</td>
                      </tr>
                      <tr>
                        <td>{t('associateInstance')}</td>
                        <td>
                        {eip.resourceId || <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('address')}</td>
                        <td>{eip.address}</td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${eip.status}`}>
                          <i className="icon"></i>
                          {t(`eipStatus.${eip.status}`)}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td><Time value={eip.created} format="YYYY-MM-DD HH:mm:ss" /></td>
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
        {this.props.context.availableInstances && this.props.context.availableInstances.length && this.renderAssociateModal()}
      </div>
    );
  }

}

export default attach(C);
