import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import Page, { attach } from '../../shared/pages/Page';
import Pagination from '../../shared/components/Pagination';
import * as Actions from '../redux/actions';
import * as VolumeActions from '../redux/actions.volume';

const F = (props) => {
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

F.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

const DeleteVolumesForm = reduxForm({
  form: 'DeleteVolumesForm',
  fields: [],
})(translate()(F));

class C extends Page {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region, routerKey } = this.props;
    dispatch(Actions.setHeader(t('volumeManage'), `/${region.regionId}/volumes`));
    dispatch(Actions.extendContext({
      status: ['active', 'deleted'],
      selected: {
      },
      currentPage: 1,
      size: 20,
      reverse: true,
      searchWord: null,
    }, routerKey));

    setTimeout(this.onRefresh(), 100);
  }

  refresh() {
    const { dispatch, region, routerKey } = this.props;

    const filters = {
      offset: (this.props.context.currentPage - 1) * this.props.context.size,
      limit: this.props.context.size,
      status: this.props.context.status,
      reverse: this.props.context.reverse,
      searchWord: this.props.context.searchWord,
    };
    dispatch(VolumeActions.requestDescribeVolumes(routerKey, region.regionId, filters))
      .then(() => {
        dispatch(Actions.extendContext({ loading: false, initialized: true }, routerKey));
      });
    dispatch(Actions.extendContext({ loading: true }, routerKey));
  }

  onRefresh(overideFilters = {}, firstPage = true) {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      if (firstPage) {
        overideFilters.currentPage = 1;
      }
      overideFilters.selected = {};

      const { dispatch, routerKey } = this.props;
      dispatch(Actions.extendContext(overideFilters, routerKey));

      setTimeout(this.refresh, 100);
    };
  }

  onSelect(item) {
    return (e) => {
      const selected = this.props.context.selected;
      if (e.target.checked) {
        selected[item.volumeId] = true;
      } else {
        delete selected[item.volumeId];
      }

      const { dispatch, routerKey } = this.props;
      dispatch(Actions.extendContext({ selected }, routerKey));
    };
  }

  onSelectAll(e) {
    const selected = this.props.context.selected;
    this.props.context.volumeSet.forEach((item) => {
      if (e.target.checked) {
        selected[item.volumeId] = true;
      } else {
        delete selected[item.volumeId];
      }
    });

    const { dispatch, routerKey } = this.props;
    dispatch(Actions.extendContext({ selected }, routerKey));
  }

  onSearchKeyPress(e) {
    if (e.key === 'Enter') {
      let searchWord = this.refs.search.value;
      if (_.isEmpty(searchWord)) {
        searchWord = null;
      }
      this.onRefresh({ searchWord })();
    }
  }

  onDelete() {
    const { dispatch, region, routerKey } = this.props;
    const volumeIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(VolumeActions.requestDeleteVolumes(routerKey, region.regionId, volumeIds))
      .then(() => {
        resolve();
        this.onRefresh({}, false)();
      }).catch(() => {
        reject();
      });
    });
  }

  renderAfterInitialized() {
    const volumes = this.props.context.volumeSet && this.props.context.volumeSet.map((volume) => {
      return (
        <tr key={volume.volumeId}>
          <td>
            <input type="checkbox" className="selected" onChange={this.onSelect(volume)} checked={this.props.context.selected[volume.volumeId] === true} />
          </td>
          <td>{volume.volumeId}</td>
          <td>
            <Link to={`/${this.props.region.regionId}/volumes/${volume.volumeId}`}>
              <strong>
                {volume.name}
              </strong>
            </Link>
          </td>
          <td className="light">{volume.created}</td>
        </tr>
      );
    });
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="top-area">
              <div className="nav-text">
                <p className="light">
                  {t('volumeManageDescription')}
                </p>
              </div>
              <div className="nav-controls">
                <Link className="btn btn-new" to={`/${this.props.region.regionId}/volumes/create`}>
                  <i className="fa fa-plus"></i>&nbsp; {t('create')}
                </Link>
              </div>
            </div>
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
                          status: ['pending', 'active', 'attaching', 'inuse', 'backup_ing', 'backup_restoring', 'deleted', 'ceased', 'error'],
                          name: t('allAvaliableStatus'),
                        }, {
                          status: ['active'],
                          name: t('volumeStatus.active'),
                        }, {
                          status: ['deleted'],
                          name: t('volumeStatus.deleted'),
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
              <div className={Object.keys(this.props.context.selected).length > 0 ? '' : 'hidden'}>
                <div className="filter-item inline">
                  <DeleteVolumesForm onSubmit={this.onDelete} />
                </div>
              </div>
            </div>
            <div className="table-holder">
              <table className="table">
                <thead>
                  <tr>
                    <th width="40">
                      <input type="checkbox" className="selected" onChange={this.onSelectAll} />
                    </th>
                    <th>{t('id')}</th>
                    <th>{t('name')}</th>
                    <th>{t('created')}</th>
                  </tr>
                </thead>
                <tbody>
                  {volumes}
                </tbody>
              </table>
            </div>
            {this.props.context.total > 0 && (
              <Pagination onRefresh={this.onRefresh} currentPage={this.props.context.currentPage} totalPage={this.props.context.totalPage} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
