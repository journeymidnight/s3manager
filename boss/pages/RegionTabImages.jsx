import _ from 'lodash';
import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import { attach } from '../../shared/pages/Page';
import ButtonForm from '../../shared/forms/ButtonForm';
import TablePage from '../../shared/pages/TablePage';
import Modal, { confirmModal } from '../../shared/components/Modal';
import * as Actions from '../redux/actions';
import * as RegionActions from '../redux/actions.region';

let ImageUpdateForm = (props) => {
  const { fields:
    { imageId, name, description, platform, osFamily, processorType },
    handleSubmit,
    submitting,
    submitFailed,
    t,
    invalid,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">

        <div className={submitFailed && imageId.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('id')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...imageId} disabled />
          </div>
        </div>

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

        <div className={submitFailed && platform.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('osPlatform')}</label>
          <div className="col-sm-10">
            <select className="form-control" {...platform} >
              <option value="unknown">{t('osPlatforms.unknown')}</option>
              <option value="windows">{t('osPlatforms.windows')}</option>
              <option value="linux">{t('osPlatforms.linux')}</option>
            </select>
            {submitFailed && platform.error && <div className="text-danger"><small>{platform.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && processorType.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('osProcessorType')}</label>
          <div className="col-sm-10">
            <select className="form-control" {...processorType} >
              <option value="unknown">{t('osProcessorTypes.unknown')}</option>
              <option value="32">{t('osProcessorTypes.32')}</option>
              <option value="64">{t('osProcessorTypes.64')}</option>
            </select>
            {submitFailed && processorType.error && <div className="text-danger"><small>{processorType.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && osFamily.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('osProcessorType')}</label>
          <div className="col-sm-10">
            <select className="form-control" {...osFamily} >
              <option value="unknown">{t('osFamilies.unknown')}</option>
              <option value="centOS">{t('osFamilies.centos')}</option>
              <option value="ubuntu">{t('osFamilies.ubuntu')}</option>
              <option value="debian">{t('osFamilies.debian')}</option>
              <option value="fedora">{t('osFamilies.fedora')}</option>
              <option value="windows">{t('osFamilies.windows')}</option>
            </select>
            {submitFailed && osFamily.error && <div className="text-danger"><small>{osFamily.error}</small></div>}
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
  fields: ['imageId', 'name', 'description', 'platform', 'osFamily', 'processorType'],
  validate: ImageUpdateForm.validate,
})(translate()(ImageUpdateForm));

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onSync = this.onSync.bind(this);
    this.update = this.update.bind(this);

    this.state = {
      image: null,
    };
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));

    this.initTable({ isTabPage: true });
  }

  onDelete() {
    const { t } = this.props;

    confirmModal(t('confirmDelete'), () => {
      const { dispatch, region2, routerKey } = this.props;
      const imageIds = _.keys(this.props.context.selected);

      return new Promise((resolve, reject) => {
        dispatch(RegionActions.requestDeleteImages(routerKey, region2.regionId, imageIds))
        .then(() => {
          resolve();
          this.onRefresh({}, false)();
        }).catch(() => {
          reject();
        });
      });
    });
  }

  onSync() {
    const { dispatch, region2, routerKey } = this.props;

    return new Promise((resolve, reject) => {
      dispatch(RegionActions.requestSyncImages(routerKey, region2.regionId))
      .then(() => {
        resolve();
        this.onRefresh({}, false)();
      }).catch(() => {
        reject();
      });
    });
  }

  onUpdate(values) {
    const { dispatch, region2, routerKey } = this.props;

    return new Promise((resolve, reject) => {
      const image = values;

      dispatch(RegionActions.requestModifyImageAttributes(routerKey, region2.regionId, image))
      .then(() => {
        resolve();
        this.onRefresh({}, false)();
        this.refs.updateModal.hide();
      }).catch(() => {
        reject();
      });
    });
  }

  update(image) {
    return (e) => {
      e.preventDefault();

      this.setState({ image });
      this.refs.updateModal.show();
    };
  }

  refreshAction(routerKey, filters) {
    const { region2 } = this.props;
    return RegionActions.requestDescribeImages(routerKey, region2.regionId, filters);
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.imageSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.imageSet.map((u) => { return u.imageId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('osFamily')}</th>
            <th>{t('osPlatform')}</th>
            <th>{t('osProcessorType')}</th>
            <th width="100"></th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.imageSet.map((image) => {
          return (
            <tr key={image.imageId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(image.imageId)} checked={this.props.context.selected[image.imageId] === true} />
              </td>
              <td>
                <a href onClick={this.update(image)}>
                  {image.imageId}
                </a>
              </td>
              <td><strong>{image.name}</strong></td>
              <td>{t(`osFamilies.${image.osFamily}`)}</td>
              <td>{t(`osPlatforms.${image.platform}`)}</td>
              <td>{t(`osProcessorTypes.${image.processorType}`)}</td>
              <td>
                <button className="btn btn-sm btn-close" onClick={this.update(image)}>
                  <i className="fa fa-cog" /> {t('pageRegion.updateImage')}
                </button>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }

  renderFilters() {
    const { t } = this.props;
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="pull-right">
            <button className="btn btn-new" onClick={this.onSync}>
              <i className="fa fa-retweet"></i>&nbsp;{t('pageRegion.syncImages')}
            </button>
          </div>
        </div>
        <div className={Object.keys(this.props.context.selected).length > 0 ? '' : 'hidden'}>
          <div className="filter-item inline">
            <ButtonForm onSubmit={this.onDelete} text={t('delete')} type="btn-danger" />
          </div>
        </div>
        <Modal title={t('pageRegion.updateImage')} ref="updateModal" >
          <ImageUpdateForm onSubmit={this.onUpdate} initialValues={this.state.image} />
        </Modal>
      </div>
    );
  }
}

export default attach(C);
