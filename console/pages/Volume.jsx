import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Modal, { confirmModal } from '../../shared/components/Modal';
import * as Actions from '../redux/actions';
import * as KeyPairActions from '../redux/actions.key_pair';

let KeyPairDeleteForm = (props) => {
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

KeyPairDeleteForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

KeyPairDeleteForm = reduxForm({
  form: 'KeyPairDeleteForm',
  fields: [],
})(translate()(KeyPairDeleteForm));

let KeyPairUpdateForm = (props) => {
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

KeyPairUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
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

    this.refresh = this.refresh.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.updateKeyPair = this.updateKeyPair.bind(this);
  }

  refresh() {
  }

  notDeleted() {
    const { keyPair } = this.props.context;
    return keyPair.status !== 'deleted' && keyPair.status !== 'ceased';
  }

  onDelete(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey, params } = this.props;

    confirmModal(t('confirmDelete'), () => {
      dispatch(KeyPairActions.requestDeleteKeyPairs(routerKey, region.regionId, [params.keyPairId]));
    });
  }

  updateKeyPair(e) {
    e.preventDefault();
    this.refs.updateModal.show();
  }

  onUpdate(values) {
    const { dispatch, region, routerKey } = this.props;
    const { keyPair } = this.props.context;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(KeyPairActions.requestModifyKeyPairAttributes(routerKey, region.regionId, keyPair.keyPairId, name, description))
        .then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
    });
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('keyPairManage'), `/${region.regionId}/keyPairs`));
  }

  render() {
    const { t, dispatch, region, routerKey, params } = this.props;

    const keyPair = this.props.context.keyPair || this.keyPair;
    if (!keyPair || keyPair.keyPairId !== params.keyPairId) {
      const keyPairId = params.keyPairId;
      dispatch(KeyPairActions.requestDescribeKeyPair(routerKey, region.regionId, keyPairId))
      .then(() => {
        this.keyPair = this.props.context.keyPair;
      });

      return <div />;
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="header">
              <ul className="nav-links clearfix">
                <li>
                  <h3 className="page-title">
                    {keyPair.keyPairId}
                  </h3>
                </li>
              </ul>
            </div>
            <div className="prepend-top-10">
              <div>
                <div className="panel panel-default">
                  <div className="panel-heading">{t('pageKeyPair.basic')}</div>
                  <div className="panel-body">

                    <dl className="dl-horizontal">
                      <dt>{t('id')}</dt>
                      <dd>{keyPair.keyPairId}</dd>
                      <dt>{t('name')}</dt>
                      <dd>
                        {keyPair.name && <strong>{keyPair.name}</strong>}
                        {!keyPair.name && <i className="text-muted">{t('noName')}</i>}
                      </dd>
                      <dt>{t('description')}</dt>
                      <dd>
                        {keyPair.description && <strong>{keyPair.description}</strong>}
                        {!keyPair.description && <i className="text-muted">{t('noName')}</i>}
                      </dd>
                      <dt>{t('created')}</dt>
                      <dd>{keyPair.created}</dd>
                    </dl>

                  </div>
                </div>

                {this.notDeleted() && <div className="panel panel-primary">
                  <button onClick={this.updateKeyPair}>update</button>
                </div>}

                {this.notDeleted() && <div className="panel panel-danger">
                  <div className="panel-heading">{t('pageKeyPair.deleteKeyPair')}</div>
                  <div className="panel-body">
                    <KeyPairDeleteForm onSubmit={this.onDelete} />
                  </div>
                </div>}
              </div>
            </div>
          </div>
        </div>
        <Modal title={t('pageInstance.updateInstance')} ref="updateModal" >
          <KeyPairUpdateForm onSubmit={this.onUpdate} initialValues={keyPair} />
        </Modal>
      </div>
    );
  }
}

export default attach(C);
