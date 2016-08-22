import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import Time from 'react-time';
import Modal, { confirmModal } from '../../shared/components/Modal';
import * as Actions from '../../console-common/redux/actions';
import * as ImageActions from '../redux/actions.image';

let ImageUpdateForm = (props) => {
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

ImageUpdateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

ImageUpdateForm.validate = () => {
  const errors = {};
  return errors;
};

ImageUpdateForm = reduxForm({
  form: 'ImageUpdateForm',
  fields: ['name', 'description'],
  validate: ImageUpdateForm.validate,
})(translate()(ImageUpdateForm));

class C extends Page {

  constructor(props) {
    super(props);

    this.deleteImage = this.deleteImage.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('privateImageManage'), `${servicePath}`));

    this.setInterval(() => {
      this.refresh();
    }, 1000);
  }

  refresh() {
    const { dispatch, routerKey, region, params } = this.props;

    const imageId = params.imageId;
    dispatch(ImageActions.requestDescribeImage(routerKey, region.regionId, imageId));
  }

  isEnabled(iamge) {
    return iamge.status === 'active';
  }

  deleteImage(e) {
    e.preventDefault();

    const { t, dispatch, region, routerKey } = this.props;
    const image = this.props.context.image;
    const imageId = image.imageId;

    confirmModal(t('confirmDelete'), () => {
      dispatch(ImageActions.requestDeleteImages(routerKey, region.regionId, [imageId]));
    });
  }

  updateImage(e) {
    e.preventDefault();
    this.refs.updateModal.show();
  }

  onUpdate(values) {
    const { dispatch, region, routerKey } = this.props;
    const image = this.props.context.image;

    const name = values.name;
    const description = values.description;
    return new Promise((resolve, reject) => {
      dispatch(ImageActions.requestModifyImageAttributes(routerKey, region.regionId, image.imageId, name, description))
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

    const image = this.props.context.image;

    return (image || null) && (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">
            <div className="top-area">
              <div className="nav-text">
                <span>{t('images')}&nbsp;<i>{image.imageId}</i></span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 side">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {t('pageImage.basic')}
                    {this.isEnabled(image) && <div className="btn-group pull-right">
                      <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bars"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a href onClick={this.updateImage}>{t('pageImage.updateImage')}</a></li>
                        <li><a href onClick={this.deleteImage}>{t('pageImage.deleteImage')}</a></li>
                      </ul>
                    </div>}
                  </div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>{t('id')}</td>
                        <td>{image.imageId}</td>
                      </tr>
                      <tr>
                        <td>{t('name')}</td>
                        <td>
                        {image.name && <strong>{image.name}</strong>}
                        {!image.name && <i className="text-muted">{t('noName')}</i>}
                        </td>
                      </tr>
                      <tr>
                        <td>{t('status')}</td>
                        <td className={`i-status i-status-${image.status}`}>
                          <i className="icon"></i>
                          {t(`imageStatus.${image.status}`)}
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td>{t('created')}</td>
                        <td><Time value={image.created} format="YYYY-MM-DD HH:mm:ss" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal title={t('pageImage.updateImage')} ref="updateModal" >
          <ImageUpdateForm onSubmit={this.onUpdate} initialValues={image} />
        </Modal>
      </div>
    );
  }

}

export default attach(C);
