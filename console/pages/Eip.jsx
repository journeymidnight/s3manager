import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Actions from '../redux/actions';
import * as EipActions from '../redux/actions.eip';

let EipDeleteForm = (props) => {
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

EipDeleteForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

EipDeleteForm = reduxForm({
  form: 'EipDeleteForm',
  fields: [],
})(translate()(EipDeleteForm));

let EipUpdateForm = (props) => {
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

EipUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
};

EipUpdateForm.validate = () => {
  const errors = {};
  return errors;
};

EipUpdateForm = reduxForm({
  form: 'EipUpdateForm',
  fields: ['name', 'description'],
  validate: EipUpdateForm.validate,
})(translate()(EipUpdateForm));

class C extends Page {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onRelease = this.onRelease.bind(this);
  }

  notDeleted() {
    const { eip } = this.props.context;
    return eip && eip.status !== 'deleted' && eip.status !== 'ceased';
  }

  refresh() {
  }

  onRelease() {
    const { dispatch, region, routerKey } = this.props;
    const { eip } = this.props.context;

    return new Promise((resolve, reject) => {
      dispatch(EipActions.requestReleaseEips(routerKey, region.regionId, [eip.eipId]))
        .then(() => {
          dispatch(EipActions.requestDescribeEip(routerKey, region.regionId, eip.eipId));
          resolve();
        }).catch(() => {
          reject();
        });
    });
  }

  onSave(values) {
    const { dispatch, region, routerKey } = this.props;
    const { eip } = this.props.context;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(EipActions.requestModifyEipAttributes(routerKey, region.regionId, eip.eipId, name, description))
        .then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
    });
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('eipManage'), `/${region.regionId}/eips`));
  }

  render() {
    const { t, dispatch, region, routerKey, params } = this.props;

    const eip = this.props.context.eip || this.eip;
    if (!eip || eip.keyPairId !== params.keyPairId) {
      const eipId = params.eipId;
      dispatch(EipActions.requestDescribeEip(routerKey, region.regionId, eipId))
      .then(() => {
        this.eip = this.props.context.eip;
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
                    {eip.eipId}
                  </h3>
                </li>
              </ul>
            </div>
            <div className="prepend-top-10">
              <div>
                <div className="panel panel-default">
                  <div className="panel-heading">{t('pageEip.basic')}</div>
                  <div className="panel-body">
                    <dl className="dl-horizontal">
                      <dt>{t('id')}</dt>
                      <dd>{eip.eipId}</dd>
                      <dt>{t('name')}</dt>
                      <dd>
                        {eip.name && <strong>{eip.name}</strong>}
                        {!eip.name && <i className="text-muted">{t('noName')}</i>}
                      </dd>
                      <dt>{t('description')}</dt>
                      <dd>
                        {eip.description && <strong>{eip.description}</strong>}
                        {!eip.description && <i className="text-muted">{t('noName')}</i>}
                      </dd>
                      <dt>{t('address')}</dt>
                      <dd>{eip.address}</dd>
                      <dt>{t('status')}</dt>
                      <dd>{eip.status}</dd>
                      <dt>{t('created')}</dt>
                      <dd>{eip.created}</dd>
                    </dl>
                  </div>
                </div>
                {this.notDeleted() && <div className="panel panel-primary">
                  <div className="panel-heading">{t('pageEip.updateEip')}</div>
                  <div className="panel-body">
                    <EipUpdateForm onSubmit={this.onSave} initialValues={eip} />
                  </div>
                </div>}
                {this.notDeleted() && <div className="panel panel-danger">
                  <div className="panel-heading">{t('pageEip.releaseEip')}</div>
                  <div className="panel-body">
                    <EipDeleteForm onSubmit={this.onRelease} />
                  </div>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
