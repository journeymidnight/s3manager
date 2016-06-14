import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as InstanceActions from '../redux/actions.instance';

let InstanceDeleteForm = (props) => {
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

InstanceDeleteForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

InstanceDeleteForm = reduxForm({
  form: 'InstanceDeleteForm',
  fields: [],
})(translate()(InstanceDeleteForm));

let InstanceUpdateForm = (props) => {
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

InstanceUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
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

class C extends RegionPage {

  constructor(props) {
    super(props);

    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.isEnabled = this.isEnabled.bind(this);
  }

  onDelete() {
    const { dispatch, region, routerKey } = this.props;
    const { instance } = this.props;

    return new Promise((resolve, reject) => {
      dispatch(InstanceActions.requestDeleteInstances(routerKey, region.regionId, [instance.instanceId]))
      .then(() => {
        dispatch(InstanceActions.requestDescribeInstance(routerKey, region.regionId, instance.instanceId));
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  onSave(values) {
    const { dispatch, region, routerKey } = this.props;
    const { instance } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(InstanceActions.requestModifyInstanceAttributes(routerKey, region.regionId, instance.instanceId, name, description))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  isEnabled() {
    const { instance } = this.props;
    return instance.status !== 'deleted' && instance.status !== 'ceased' && instance.status !== 'error';
  }

  render() {
    const { t, instance } = this.props;

    return (
      <div className="content">
        <div className="clearfix">
          <div className="panel panel-default">
            <div className="panel-heading">{t('pageInstance.basic')}</div>
            <div className="panel-body">

              <dl className="dl-horizontal">
                <dt>{t('id')}</dt>
                <dd>{instance.instanceId}</dd>
                <dt>{t('name')}</dt>
                <dd>
                {instance.name && <strong>{instance.name}</strong>}
                {!instance.name && <i className="text-muted">{t('noName')}</i>}
                </dd>
                <dt>{t('description')}</dt>
                <dd>
                {instance.description && <strong>{instance.description}</strong>}
                {!instance.description && <i className="text-muted">{t('noName')}</i>}
                </dd>
                <dt>{t('status')}</dt>
                <dd className={`i-status i-status-${instance.status}`}>
                  <i className="icon"></i>
                  {t(`instanceStatus.${instance.status}`)}
                </dd>
                <dt>{t('created')}</dt>
                <dd>{instance.created}</dd>
              </dl>

            </div>
          </div>

          {this.isEnabled() && <div className="panel panel-primary">
            <div className="panel-heading">{t('pageInstance.updateInstance')}</div>
            <div className="panel-body">
              <InstanceUpdateForm onSubmit={this.onSave} initialValues={instance} />
            </div>
          </div>}

          {this.isEnabled() && <div className="panel panel-danger">
            <div className="panel-heading">{t('pageInstance.deleteInstance')}</div>
            <div className="panel-body">
              <InstanceDeleteForm onSubmit={this.onDelete} />
            </div>
          </div>}
        </div>
      </div>
    );
  }
}

export default attach(C);
