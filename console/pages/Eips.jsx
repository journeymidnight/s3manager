import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Time from 'react-time';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import * as Actions from '../redux/actions';
import * as EipActions from '../redux/actions.eip';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('eipManage'), `/${region.regionId}/eips`));

    this.initTable();
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return EipActions.requestDescribeEips(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { dispatch, routerKey, region } = this.props;
    const eipIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(EipActions.requestReleaseEips(routerKey, region.regionId, eipIds))
        .then(() => {
          resolve();
          this.onRefresh({}, false)();
        }).catch(() => {
          reject();
        });
    });
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.eipSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.eipSet.map((u) => { return u.eipId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('bandwidth')}</th>
            <th>{t('associateInstance')}</th>
            <th>{t('address')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.eipSet.map((eip) => {
            return (
              <tr key={eip.eipId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(eip.eipId)} checked={this.props.context.selected[eip.eipId] === true} />
                </td>
                <td>
                  <Link to={`/${this.props.region.regionId}/eips/${eip.eipId}`}>
                    {eip.eipId}
                  </Link>
                </td>
                <td>
                  {eip.name && <strong>{eip.name}</strong>}
                  {!eip.name && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td>{eip.bandwidth}Mb</td>
                <td>
                  {eip.resourceId || <i className="text-muted">{t('noName')}</i>}
                </td>
                <td>{eip.address}</td>
                <td className={`i-status i-status-${eip.status}`}>
                  <i className="icon"></i>
                  {t(`eipStatus.${eip.status}`)}
                </td>
                <td className="light"><Time value={eip.created} format="YYYY-MM-DD HH:mm:ss" /></td>
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
            {t('eipManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to={`/${this.props.region.regionId}/eips/create`}>
            <i className="fa fa-plus"></i>&nbsp; {t('create')}
          </Link>
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
                        status: ['active', 'associated', 'deleted', 'ceased'],
                        name: t('allAvaliableStatus'),
                      }, {
                        status: ['active'],
                        name: t('eipStatus.active'),
                      }, {
                        status: ['associated'],
                        name: t('eipStatus.associated'),
                      }, {
                        status: ['ceased', 'deleted'],
                        name: t('eipStatus.deleted'),
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
            <ButtonForm onSubmit={this.onDelete} text={t('delete')} type="btn-danger" />
          </div>
        </div>
      </div>
    );
  }

}

export default attach(C);
