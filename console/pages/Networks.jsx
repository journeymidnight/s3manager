import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';
import * as NetworkActions from '../redux/actions.network';

class C extends RegionPage {

  constructor(props) {
    super(props);

    this.state = {
      status: ['pending', 'active'],
      currentPage: 1,
      size: 10,
      sortedBy: 'created',
      reverse: true,
      searchWord: null,
      loading: true,
    };
    this.refresh = this.refresh.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), `/${region.regionId}/networks`));

    this.refresh()();
  }

  refresh(overideFilters = {}, firstPage = true) {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      if (firstPage) {
        overideFilters.currentPage = 1;
      }
      this.setState(Object.assign(this.state, overideFilters));
      this.onRefresh();
    };
  }

  onRefresh() {
    const { dispatch, region, routerKey } = this.props;

    const filters = {
      currentPage: this.state.currentPage,
      size: this.state.size,
      status: this.state.status,
      sortedBy: this.state.sortedBy,
      reverse: this.state.reverse,
      searchWord: this.state.searchWord,
    };
    dispatch(NetworkActions.requestDescribeNetworks(routerKey, region.regionId, filters))
    .then(() => {
      this.setState({ loading: false });
    });
    this.setState({ loading: true });
  }

  onSearchKeyPress(e) {
    if (e.key === 'Enter') {
      let searchWord = this.refs.search.value;
      if (_.isEmpty(searchWord)) {
        searchWord = null;
      }
      this.refresh({ searchWord })();
    }
  }

  render() {
    const { t } = this.props;
    const networks = this.props.context.networkSet && this.props.context.networkSet.map((network) => {
      return (
        <tr key={network.networkId}>
          <td>
            <input type="checkbox" className="selected" />
          </td>
          <td>{network.networkId}</td>
          <td>
            <Link to={`/${this.props.region.regionId}/networks/${network.networkId}`}>
              <strong>
                {network.name}
              </strong>
            </Link>
          </td>
          <td className={`i-status i-status-${network.status}`}>
            <i className="icon"></i>
            {t(`networkStatus.${network.status}`)}
          </td>
          <td className="light">{network.created}</td>
        </tr>
      );
    });
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="top-area">
              <div className="nav-text">
                <span className="light">
                  {t('networkManageDescription')}
                </span>
              </div>
              <div className="nav-controls">
                <Link className="btn btn-new" to={`/${this.props.region.regionId}/networks/create`}>
                  <i className="fa fa-plus"></i>&nbsp;{t('create')}
                </Link>
              </div>
            </div>
            <div>
              <div className="gray-content-block second-block">
                <div>
                  <div className="filter-item inline">
                    <a className="btn btn-default" onClick={this.refresh({}, false)}>
                      <i className={`fa fa-refresh ${this.state.loading ? 'fa-spin' : ''}`}></i>
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
                            status: ['pending', 'active'],
                            name: t('allAvaliableStatus'),
                          }, {
                            status: ['pending'],
                            name: t('networkStatus.pending'),
                          }, {
                            status: ['active'],
                            name: t('networkStatus.active'),
                          }, {
                            status: ['deleted'],
                            name: t('networkStatus.deleted'),
                          }, {
                            status: ['ceased'],
                            name: t('networkStatus.ceased'),
                          }].map((filter) => {
                            return (
                              <li key={filter.name}>
                                <a className={this.state.status.toString() === filter.status.toString() ? 'is-active' : ''} href onClick={this.refresh({ status: filter.status })}>{filter.name}</a>
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
                        <span className="light"></span> {this.state.reverse ? t('lastCreated') : t('firstCreated')}
                        <b className="caret"></b></button>
                      <ul className="dropdown-menu dropdown-menu-align-right dropdown-select dropdown-menu-selectable">
                        <li><a className={this.state.reverse ? 'is-active' : ''} href onClick={this.refresh({ reverse: true })}>{t('lastCreated')}</a></li>
                        <li><a className={this.state.reverse ? '' : 'is-active'} href onClick={this.refresh({ reverse: false })}>{t('firstCreated')}</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="issues_bulk_update hide">
                  <form action="/root/awesome/issues/bulk_update" acceptCharset="UTF-8" method="post">
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value="PZuv4woG3ysArunCYx9YRyzCCaSXeXu3AohlXT0Z/6z1PtyjvcIQvoFivxW0KN7XlFACfXP3CT6x5S77kex/og==" />
                    <div className="filter-item inline">
                      <div className="dropdown">
                        <button className="dropdown-menu-toggle js-issue-status" type="button" data-field-name="update[state_event]" data-toggle="dropdown">
                          <span className="dropdown-toggle-text">Status</span>
                          <i className="fa fa-chevron-down"></i>
                        </button>
                        <div className="dropdown-menu dropdown-select dropdown-menu-status dropdown-menu-selectable">
                          <div className="dropdown-title">
                            <span>Change status</span>
                            <button className="dropdown-title-button dropdown-menu-close" aria-label="Close" type="button">
                              <i className="fa fa-times dropdown-menu-close-icon"></i>
                            </button>
                          </div>
                          <div className="dropdown-content">
                            <ul>
                              <li>
                                <a data-id="reopen" href="#">Open</a></li>
                              <li>
                                <a data-id="close" href="#">Closed</a></li>
                            </ul>
                          </div>
                          <div className="dropdown-loading">
                            <i className="fa fa-spinner fa-spin"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="filter-item inline">
                      <div className="dropdown">
                        <button className="dropdown-menu-toggle js-user-search js-update-assignee js-filter-submit js-filter-bulk-update" type="button" data-first-user="root" data-null-user="true" data-current-user="true" data-project-id="1" data-field-name="update[assignee_id]" data-toggle="dropdown">
                          <span className="dropdown-toggle-text">Assignee</span>
                          <i className="fa fa-chevron-down"></i>
                        </button>
                        <div className="dropdown-menu dropdown-select dropdown-menu-user dropdown-menu-selectable">
                          <div className="dropdown-title">
                            <span>Assign to</span>
                            <button className="dropdown-title-button dropdown-menu-close" aria-label="Close" type="button">
                              <i className="fa fa-times dropdown-menu-close-icon"></i>
                            </button>
                          </div>
                          <div className="dropdown-input">
                            <input type="search" id="" className="dropdown-input-field" placeholder="Search authors" value="" />
                            <i className="fa fa-search dropdown-input-search"></i>
                            <i role="button" className="fa fa-times dropdown-input-clear js-dropdown-input-clear"></i>
                          </div>
                          <div className="dropdown-content"></div>
                          <div className="dropdown-loading">
                            <i className="fa fa-spinner fa-spin"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="filter-item inline">
                      <div className="dropdown">
                        <button className="dropdown-menu-toggle js-milestone-select js-extra-options js-filter-submit js-filter-bulk-update" type="button" data-show-no="true" data-field-name="update[milestone_id]" data-project-id="1" data-milestones="/root/awesome/milestones.json" data-use-id="true" data-toggle="dropdown">
                          <span className="dropdown-toggle-text">Milestone</span>
                          <i className="fa fa-chevron-down"></i>
                        </button>
                        <div className="dropdown-menu dropdown-select dropdown-menu-selectable dropdown-menu-milestone">
                          <div className="dropdown-title">
                            <span>Assign milestone</span>
                            <button className="dropdown-title-button dropdown-menu-close" aria-label="Close" type="button">
                              <i className="fa fa-times dropdown-menu-close-icon"></i>
                            </button>
                          </div>
                          <div className="dropdown-input">
                            <input type="search" id="" className="dropdown-input-field" placeholder="Search milestones" value="" />
                            <i className="fa fa-search dropdown-input-search"></i>
                            <i role="button" className="fa fa-times dropdown-input-clear js-dropdown-input-clear"></i>
                          </div>
                          <div className="dropdown-content"></div>
                          <div className="dropdown-loading">
                            <i className="fa fa-spinner fa-spin"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <input type="hidden" name="update[issues_ids]" id="update_issues_ids" value="" />
                    <input type="hidden" name="state_event" id="state_event" />
                    <div className="filter-item inline">
                      <button name="button" type="submit" className="btn update_selected_issues btn-save">Update issues</button></div>
                  </form>
                </div>
              </div>
              <div className="filtered-labels gray-content-block hidden second-block"></div>
            </div>
            <div className="table-holder">
              <table className="table">
                <thead>
                  <tr>
                    <th width="40">
                      <input type="checkbox" className="selected" />
                    </th>
                    <th width="150">{t('id')}</th>
                    <th>{t('name')}</th>
                    <th>{t('status')}</th>
                    <th width="200">{t('created')}</th>
                  </tr>
                </thead>
                <tbody>
                {networks}
                </tbody>
              </table>
            </div>
            {this.props.context.currentPage && <div className="gl-pagination">
              <ul className="pagination clearfix">
                {this.props.context.currentPage > 1 && <li>
                  <a href onClick={this.refresh({ currentPage: 1 })}>
                    {t('paging.first')}
                  </a>
                </li>}
                {this.props.context.currentPage > 1 && <li>
                  <a href onClick={this.refresh({ currentPage: this.props.context.currentPage - 1 }, false)}>
                    {this.props.context.currentPage - 1}
                  </a>
                </li>}
                <li className="active">
                  <span>{this.props.context.currentPage}</span>
                </li>
                {this.props.context.currentPage * this.props.context.size < this.props.context.total && <li>
                  <a href onClick={this.refresh({ currentPage: this.props.context.currentPage + 1 }, false)}>
                    {this.props.context.currentPage + 1}
                  </a>
                </li>}
                {this.props.context.currentPage * this.props.context.size < this.props.context.total && <li>
                  <a href onClick={this.refresh({ currentPage: parseInt(this.props.context.total / this.props.context.size, 10) }, false)}>{t('paging.last')}</a>
                </li>}
              </ul>
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
