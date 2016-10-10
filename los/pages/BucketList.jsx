import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import { confirmModal } from '../../shared/components/Modal';
import { buttonForm } from '../../shared/forms/ButtonForm';
import TablePageStatic from '../../shared/pages/TablePageStatic';
import { setHeader } from '../../console-common/redux/actions';
import * as BucketActions from '../redux/actions.bucket';


class C extends TablePageStatic {

  constructor() {
    super();

    this.refresh = this.refresh.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(setHeader(t('bucketList'), `${servicePath}/buckets`));
    this.initTable(routerKey, {});
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return BucketActions.setVisibleBuckets(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { t, dispatch, region, routerKey } = this.props;
    const bucketName = _.keys(this.props.context.selected)[0];

    confirmModal(t('confirmDelete'), () => dispatch(BucketActions.requestDeleteBucket(routerKey, region.regionId, bucketName))
      .then(() => {
        this.onRefresh({}, false)();
      }));
  }

  renderTable() {
    const { t, servicePath, dispatch, context } = this.props;
    return context.total > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(context.visibleBuckets.map((u) => { return u.name; }))} />
            </th>
            <th width="200">{t('name')}</th>
            <th width="400">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {context.visibleBuckets.map((bucket) => {
          return (
            <tr key={bucket.name}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(bucket.name)} checked={context.selected[bucket.name] === true} />
              </td>
              <td>
                <Link
                  to={`${servicePath}/buckets/${bucket.name}`}
                  onClick={() => {
                    dispatch(BucketActions.setBucket({
                      bucketName: bucket.name,
                      bucketCreationDate: bucket.creationDate,
                    }));
                  }}
                >
                  {bucket.name}
                </Link>
              </td>
              <td>{moment.utc(bucket.creationDate).local().format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
      );
  }

  renderHeader() {
    const { t, servicePath } = this.props;
    return (
      <div className="top-area">
        <div className="nav-text">
          <span>{t('bucketListDescription')}</span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`${servicePath}/buckets/create`}>
            <i className="fa fa-plus" />&nbsp;{t('create')}
          </Link>
        </div>
      </div>
    );
  }

  renderFilters() {
    const { t, context } = this.props;
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${context.loading ? 'fa-spin' : ''}`} />
            </a>
          </div>

          <div className="filter-item inline">
            <input type="search" ref="search" placeholder={t('filterByBucketName')} className="form-control" onKeyPress={this.onSearchKeyPress} />
          </div>
        </div>
        {Object.keys(context.selected).length > 0 && <div>
          <div className="filter-item inline">
            {React.cloneElement(buttonForm(), {
              onSubmit: this.onDelete,
              text: t('delete'),
              type: 'btn-danger',
              disabled: (_.keys(context.selected).length > 1),
            })}
          </div>
        </div>}
      </div>
    );
  }
}

export default attach(C);
