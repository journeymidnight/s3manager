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

let InstanceTypeCreateForm = (props) => {
  const { fields:
    { memory, vcpus, disk },
    handleSubmit,
    submitting,
    submitFailed,
    t,
    invalid,
  } = props;
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="modal-body">

        <div className={submitFailed && vcpus.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('vcpus')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...vcpus} />
            {submitFailed && vcpus.error && <div className="text-danger"><small>{vcpus.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && memory.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('memory')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...memory} />
            {submitFailed && memory.error && <div className="text-danger"><small>{memory.error}</small></div>}
          </div>
        </div>

        <div className={submitFailed && disk.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('disk')}</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" {...disk} />
            {submitFailed && disk.error && <div className="text-danger"><small>{disk.error}</small></div>}
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

InstanceTypeCreateForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  invalid: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

InstanceTypeCreateForm.validate = () => {
  const errors = {};
  return errors;
};

InstanceTypeCreateForm = reduxForm({
  form: 'InstanceTypeCreateForm',
  fields: ['vcpus', 'memory', 'disk'],
  validate: InstanceTypeCreateForm.validate,
})(translate()(InstanceTypeCreateForm));

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onGenerate = this.onGenerate.bind(this);
    this.showCreateModal = this.showCreateModal.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));

    this.initTable({ status: ['active'], isTabPage: true });
  }

  onDelete() {
    const { t } = this.props;

    confirmModal(t('confirmDelete'), () => {
      const { dispatch, region2, routerKey } = this.props;
      const instanceTypeIds = _.keys(this.props.context.selected);

      return new Promise((resolve, reject) => {
        dispatch(RegionActions.requestDeleteInstanceTypes(routerKey, region2.regionId, instanceTypeIds))
        .then(() => {
          resolve();
          this.onRefresh({}, false)();
        }).catch(() => {
          reject();
        });
      });
    });
  }

  showCreateModal(e) {
    e.preventDefault();
    this.refs.createModal.show();
  }

  onCreate(values) {
    const { dispatch, region2, routerKey } = this.props;

    return new Promise((resolve, reject) => {
      const instanceType = {
        vcpus: parseInt(values.vcpus, 10),
        memory: parseInt(values.memory, 10),
        disk: parseInt(values.disk, 10),
      };

      dispatch(RegionActions.requestCreateInstanceType(routerKey, region2.regionId, instanceType))
      .then(() => {
        resolve();
        this.refs.createModal.hide();
      }).catch(() => {
        reject();
      });
    });
  }

  onGenerate(e) {
    e.preventDefault();
    const { dispatch, region2, routerKey } = this.props;

    dispatch(RegionActions.requestGenerateInstanceTypes(routerKey, region2.regionId))
    .then(() => {
      this.onRefresh({}, false)();
    }).catch(() => {
    });
  }

  refreshAction(routerKey, filters) {
    const { region2 } = this.props;
    return RegionActions.requestDescribeInstanceTypes(routerKey, region2.regionId, filters);
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.instanceTypeSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(this.props.context.instanceTypeSet.map((u) => { return u.instanceTypeId; }))}
              />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('status')}</th>
            <th>{t('vcpus')}</th>
            <th>{t('memory')}</th>
            <th>{t('disk')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.instanceTypeSet.map((instanceType) => {
          return (
            <tr key={instanceType.instanceTypeId}>
              <td>
                <input
                  type="checkbox"
                  className="selected"
                  onChange={this.onSelect(instanceType.instanceTypeId)}
                  checked={this.props.context.selected[instanceType.instanceTypeId] === true}
                />
              </td>
              <td>{instanceType.instanceTypeId}</td>
              <td><strong>{instanceType.name}</strong></td>
              <td className={`i-status i-status-${instanceType.status}`}>
                <i className="icon"></i>
                {t(`instanceTypeStatus.${instanceType.status}`)}
              </td>
              <td>{instanceType.vcpus}</td>
              <td>{instanceType.memory} MB</td>
              <td>{instanceType.disk} GB</td>
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
          <div className="filter-item inline labels-filter">
            <div className="dropdown">
              <button className="dropdown-menu-toggle" data-toggle="dropdown" type="button">
                <span className="dropdown-toggle-text">{t('status')}</span>
                <i className="fa fa-chevron-down"></i>
              </button>
              <div className="dropdown-menu dropdown-select dropdown-menu-selectable">
                <div className="dropdown-content">
                  <ul>
                  {[{
                    status: ['active'],
                    name: t('instanceTypeStatus.active'),
                  }, {
                    status: ['deleted'],
                    name: t('instanceTypeStatus.deleted'),
                  }].map((filter) => {
                    return (
                      <li key={filter.name}>
                        <a
                          className={this.props.context.status.toString() === filter.status.toString() ? 'is-active' : ''}
                          href
                          onClick={this.onRefresh({ status: filter.status })}
                        >
                          {filter.name}
                        </a>
                      </li>
                    );
                  })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="filter-item inline pull-right">
            <a href className="btn btn-new" onClick={this.showCreateModal}>
              <i className="fa fa-plus"></i>&nbsp;{t('create')}
            </a>
            <Modal title={t('pageRegion.createInstanceType')} ref="createModal" >
              <InstanceTypeCreateForm onSubmit={this.onCreate} initialValues={{ name: 'c1m1024d0', vcpus: 1, memory: 1024, disk: 10 }} />
            </Modal>
          </div>
          <div className="filter-item inline pull-right">
            <a href className="btn btn-info" onClick={this.onGenerate}>
              {t('pageRegion.generateInstanceTypes')}
            </a>
          </div>
        </div>
        <div className={Object.keys(this.props.context.selected).length > 0 ? '' : 'hidden'}>
          <div className="filter-item inline">
            <ButtonForm onSubmit={this.onDelete} text={t('delete')} type="btn-danger" />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
