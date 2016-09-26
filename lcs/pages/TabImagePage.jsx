import React from 'react';
import _ from 'lodash';
import Time from 'react-time';
import { Link } from 'react-router';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import { confirmModal } from '../../shared/components/Modal';
import StatusFilter from '../../shared/components/StatusFilter';
import TimeSorter from '../../shared/components/TimeSorter';
import SearchBox from '../../shared/components/SearchBox';
import * as Actions from '../../console-common/redux/actions';
import * as ImageActions from '../redux/actions.image';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(this.isPublicImage() ? t('publicImageManage') : t('privateImageManage'), `${servicePath}/images_snapshots`));

    this.initTable(routerKey, {
      isTabPage: true,
      status: ['active'],
    });
  }

  // need inherit
  isPublicImage() {
  }

  formatImageSize(size) {
    let result = '';
    if (size / (1024 * 1024 * 1024) >= 1) {
      result = `${(size / (1024 * 1024 * 1024)).toFixed(2)}GB`;
    } else if (size / (1024 * 1024) >= 1) {
      result = `${(size / (1024 * 1024)).toFixed(2)}MB`;
    } else if (size / (1024) >= 1) {
      result = `${(size / 1024).toFixed(2)}KB`;
    } else {
      result = `${size}B`;
    }
    return result;
  }

  onDelete() {
    const { t, dispatch, routerKey, region } = this.props;
    const imageIds = _.keys(this.props.context.selected);

    confirmModal(t('confirmDelete'), () => {
      return new Promise((resolve, reject) => {
        dispatch(ImageActions.requestDeleteImages(routerKey, region.regionId, imageIds))
          .then(() => {
            resolve();
            this.onRefresh({}, false)();
          }).catch(() => {
            reject();
          });
      });
    });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    const isPublic = this.isPublicImage();
    const requestFilter = Object.assign({}, filters, { isPublic });
    return ImageActions.requestDescribeImages(routerKey, region.regionId, requestFilter);
  }

  renderTable() {
    const { t, servicePath } = this.props;
    return this.props.context.total > 0 && this.props.context.imageSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            {!this.isPublicImage() && <th width="40">
              <input
                type="checkbox"
                className="selected"
                onChange={this.onSelectAll(this.props.context.imageSet.map((u) => { return u.imageId; }))}
                checked={this.isAllSelected(this.props.context.imageSet.map((u) => { return u.imageId; }))}
              />
            </th>}
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('size')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.imageSet.map((image) => {
            return (
              <tr key={image.imageId}>
                {!this.isPublicImage() && <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(image.imageId)} checked={this.props.context.selected[image.imageId] === true} />
                </td>}
                <td>
                  {!this.isPublicImage() && <Link to={`${servicePath}/images/${image.imageId}`}>{image.imageId}</Link>}
                  {this.isPublicImage() && <span>{image.imageId}</span>}
                </td>
                <td>
                  {image.name && <strong>{image.name}</strong>}
                  {!image.name && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td>{this.formatImageSize(image.size)}</td>
                <td className={`i-status i-status-${image.status}`}>
                  <i className="icon"></i>
                  {t(`imageStatus.${image.status}`)}
                </td>
                <td className="light"><Time value={image.created} format="YYYY-MM-DD HH:mm:ss" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderFilters() {
    const { t } = this.props;
    const statusOption = [
      {
        status: ['active'],
        name: t('imageStatus.active'),
      }, {
        status: ['pending'],
        name: t('imageStatus.pending'),
      }, {
        status: ['deleted', 'ceased'],
        name: t('imageStatus.deleted'),
      }];
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.doSearch}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
          </div>
          <div className="filter-item inline labels-filter">
            <StatusFilter statusOption={statusOption} filterStatus={this.props.context.status} onRefresh={this.onRefresh} />
          </div>
          <div className="filter-item inline">
            <SearchBox ref="searchBox" placeholder={t('filterByIdorName')} onEnterPress={this.onSearchKeyPress} onButtonClick={this.onSearchButtonClick} />
          </div>
          <div className="pull-right">
            <TimeSorter isReverse={this.props.context.reverse} onRefresh={this.onRefresh} />
          </div>
        </div>
        {!this.isPublicImage() && <div className={Object.keys(this.props.context.selected).length > 0 ? '' : 'hidden'}>
          <div className="filter-item inline">
            <ButtonForm onSubmit={this.onDelete} text={t('delete')} type="btn-danger" />
          </div>
        </div>}
      </div>
    );
  }


  renderHeader() {
    const { t } = this.props;
    return (
      <div className="top-area">
        <div className="nav-text">
          <span className="light">
            {this.isPublicImage() ? t('publicImageManageDescription') : t('privateImageManageDescription')}
          </span>
        </div>
      </div>
    );
  }

}
export default C;
