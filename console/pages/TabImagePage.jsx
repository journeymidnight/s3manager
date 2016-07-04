import React from 'react';
import Time from 'react-time';
import TablePage from '../../shared/pages/TablePage';
import * as Actions from '../redux/actions';
import * as ImageActions from '../redux/actions.image';

class C extends TablePage {

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('publicImageManage'), `/${region.regionId}/images_snapshots/public_images`));

    this.initTable({ isTabPage: true });
  }

  // need inherit
  isPublicImage() {

  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    const isPublic = this.isPublicImage();
    const requestFilter = Object.assign({}, filters, { isPublic });
    return ImageActions.requestDescribeImages(routerKey, region.regionId, requestFilter);
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
            <th>{t('size')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.imageSet.map((image) => {
            return (
              <tr key={image.imageId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(image.imageId)} checked={this.props.context.selected[image.imageId] === true} />
                </td>
                <td>{image.imageId}</td>
                <td>
                  {image.name && <strong>{image.name}</strong>}
                  {!image.name && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td>{image.size}MB</td>
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


  renderHeader() {
    const { t } = this.props;
    return (
      <div className="top-area">
        <div className="nav-text">
          <span className="light">
            {t('publicImageManageDescription')}
          </span>
        </div>
      </div>
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
                    {[
                      {
                        status: ['pending', 'active', 'deleted', 'ceased'],
                        name: t('allAvaliableStatus'),
                      }, {
                        status: ['pending'],
                        name: t('imageStatus.pending'),
                      }, {
                        status: ['active'],
                        name: t('imageStatus.active'),
                      }, {
                        status: ['deleted', 'ceased'],
                        name: t('imageStatus.deleted'),
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
          <div className="filter-item inline">
            <input type="search" ref="search" placeholder={t('filterByIdorName')} className="form-control" onKeyPress={this.onSearchKeyPress} />
          </div>
          <div className="pull-right">
            <div className="dropdown inline prepend-left-10">
              <button className="dropdown-toggle btn" data-toggle="dropdown" type="button">
                <span className="light"></span> {this.props.context.reverse ? t('lastCreated') : t('firstCreated')}
                <b className="caret"></b></button>
              <ul className="dropdown-menu dropdown-menu-align-right dropdown-select dropdown-menu-selectable">
                <li><a className={this.props.context.reverse ? 'is-active' : ''} href onClick={this.onRefresh({ reverse: true })}>{t('lastCreated')}</a></li>
                <li><a className={this.props.context.reverse ? '' : 'is-active'} href onClick={this.onRefresh({ reverse: false })}>{t('firstCreated')}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default C;
