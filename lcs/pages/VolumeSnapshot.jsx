import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Time from 'react-time';
import Modal, { confirmModal } from '../../shared/components/Modal';
import * as Actions from '../../console-common/redux/actions';
import * as SnapshotActions from '../redux/actions.snapshot';

let TabVolumeSnapshotUpdateForm = (props) => {
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

TabVolumeSnapshotUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

TabVolumeSnapshotUpdateForm.validate = () => {
  const errors = {};
  return errors;
};

TabVolumeSnapshotUpdateForm = reduxForm({
  form: 'TabVolumeSnapshotUpdateForm',
  fields: ['name', 'description'],
  validate: TabVolumeSnapshotUpdateForm.validate,
})(translate()(TabVolumeSnapshotUpdateForm));

class C extends Page {

  constructor(props) {
    super(props);

    this.deleteSnapshot = this.deleteSnapshot.bind(this);
    this.updateSnapshot = this.updateSnapshot.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('volumeSnapshotManage'), `${servicePath}/images_snapshots`));

    this.setInterval(() => {
      this.refresh();
    }, 1000);
  }

  refresh() {
    const { dispatch, routerKey, region, params } = this.props;

    const snapshotId = params.snapshotId;
    dispatch(SnapshotActions.requestDescribeSnapshot(routerKey, region.regionId, snapshotId));
  }

  isEnabled(snapshot) {
    return snapshot.status === 'active';
  }

  deleteSnapshot(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey } = this.props;
    const snapshotId = this.props.context.snapshot.snapshotId;

    confirmModal(t('confirmDelete'), () => {
      dispatch(SnapshotActions.requestDeleteSnapshots(routerKey, region.regionId, [snapshotId]));
    });
  }

  updateSnapshot(e) {
    e.preventDefault();

    this.refs.updateModal.show();
  }

  onUpdate(values) {
    const { dispatch, region, routerKey } = this.props;
    const snapshot = this.props.context.snapshot;

    const name = values.name;
    const description = values.description;
    return new Promise((resolve, reject) => {
      dispatch(SnapshotActions.requestModifySnapshotAttributes(routerKey, region.regionId, snapshot.snapshotId, name, description))
        .then(() => {
          resolve();
          this.refs.updateModal.hide();
        }).catch(() => {
          reject();
        });
    });
  }

  render() {
    const { t } = this.props;

    const snapshot = this.props.context.snapshot;

    return (snapshot || null) && (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">
            <div className="top-area">
              <div className="nav-text">
                <span>{t('volume_snapshots')}&nbsp;<i>{snapshot.snapshotId}</i></span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageSnapshot.basic')}
                    {this.isEnabled(snapshot) && <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a href onClick={this.updateSnapshot}>{t('pageSnapshot.updateSnapshot')}</a></li>
                        <li><a href onClick={this.deleteSnapshot}>{t('pageSnapshot.deleteSnapshot')}</a></li>
                      </ul>
                    </div>}
                  </div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td>{snapshot.snapshotId}</td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                        {snapshot.name && <strong>{snapshot.name}</strong>}
                        {!snapshot.name && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('description')}</td>
                        <td>
                          <span>
                          {snapshot.description && <span>{snapshot.description}</span>}
                          {!snapshot.description && <i className="text-muted">{t('noName')}</i>}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${snapshot.status}`}>
                          <i className="icon"></i>
                          {t(`volumeSnapshotsStatus.${snapshot.status}`)}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td><Time value={snapshot.created} format="YYYY-MM-DD HH:mm:ss" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal title={t('pageSnapshot.updateSnapshot')} ref="updateModal" >
          <TabVolumeSnapshotUpdateForm onSubmit={this.onUpdate} initialValues={snapshot} />
        </Modal>
      </div>
    );
  }

}

export default attach(C);
