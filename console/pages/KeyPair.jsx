import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Time from 'react-time';
import Modal, { confirmModal } from '../../shared/components/Modal';
import * as Actions from '../redux/actions';
import * as KeyPairActions from '../redux/actions.key_pair';

let KeyPairUpdateForm = (props) => {
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

KeyPairUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

KeyPairUpdateForm.validate = () => {
  const errors = {};
  return errors;
};

KeyPairUpdateForm = reduxForm({
  form: 'KeyPairUpdateForm',
  fields: ['name', 'description'],
  validate: KeyPairUpdateForm.validate,
})(translate()(KeyPairUpdateForm));

class C extends Page {

  constructor(props) {
    super(props);

    this.deleteKeyPair = this.deleteKeyPair.bind(this);
    this.updateKeyPair = this.updateKeyPair.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('keyPairManage'), `/${region.regionId}/key_pairs`));
    this.setInterval(() => {
      this.refresh();
    }, 2000);
    this.refresh();
  }

  refresh() {
    const { dispatch, routerKey, region, params } = this.props;

    const keyPairId = params.keyPairId;
    dispatch(KeyPairActions.requestDescribeKeyPair(routerKey, region.regionId, keyPairId));
  }

  isEnabled(keyPair) {
    return keyPair.status === 'active';
  }

  deleteKeyPair(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey } = this.props;
    const keyPairId = this.props.context.keyPair.keyPairId;

    confirmModal(t('confirmDelete'), () => {
      dispatch(KeyPairActions.requestDeleteKeyPairs(routerKey, region.regionId, [keyPairId]));
    });
  }

  updateKeyPair(e) {
    e.preventDefault();

    this.refs.updateModal.show();
  }

  onUpdate(values) {
    const { dispatch, region, routerKey } = this.props;
    const keyPair = this.props.context.keyPair;

    const name = values.name;
    const description = values.description;

    dispatch(KeyPairActions.requestModifyKeyPairAttributes(routerKey, region.regionId, keyPair.keyPairId, name, description))
      .then(() => {
        this.refs.updateModal.hide();
      });
  }

  render() {
    const { t } = this.props;

    const keyPair = this.props.context.keyPair;

    return (keyPair || null) && (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">
            <div className="top-area">
              <div className="nav-text">
                <span>{t('key_pair')}&nbsp;<i>{keyPair.keyPairId}</i></span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageKeyPair.basic')}
                    {this.isEnabled(keyPair) && <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a href onClick={this.updateKeyPair}>{t('pageKeyPair.updateKeyPair')}</a></li>
                        <li><a href onClick={this.deleteKeyPair}>{t('pageKeyPair.deleteKeyPair')}</a></li>
                      </ul>
                    </div>}
                  </div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td>{keyPair.keyPairId}</td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                        {keyPair.name && <strong>{keyPair.name}</strong>}
                        {!keyPair.name && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${keyPair.status}`}>
                          <i className="icon"></i>
                          {t(`keyPairStatus.${keyPair.status}`)}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td><Time value={keyPair.created} format="YYYY-MM-DD HH:mm:ss" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal title={t('pageKeyPair.updateKeyPair')} ref="updateModal" >
          <KeyPairUpdateForm onSubmit={this.onUpdate} initialValues={keyPair} />
        </Modal>
      </div>
    );
  }

}

export default attach(C);
