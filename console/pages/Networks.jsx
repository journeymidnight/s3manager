import React from 'react';
import { Link } from 'react-router';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';
import * as NetworkActions from '../redux/actions.network';

class C extends RegionPage {

  componentDidMount() {
    const { t, dispatch, region, routerKey } = this.props;
    dispatch(NetworkActions.requestDescribeNetworks(routerKey, region.regionId));

    dispatch(Actions.setHeader(t('networkManage'), `/${region.regionId}/networks`));
  }

  render() {
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
          <td className="light">{network.created}</td>
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
            <div className="issues-filters">
              <div className="issues-details-filters gray-content-block second-block">
                <form className="filter-form" action="/root/awesome/issues?scope=all&amp;sort=id_desc&amp;state=closed" acceptCharset="UTF-8" method="get">
                  <div className="issues-other-filters">
                    <div className="filter-item inline">
                      <Link className="btn btn-default" to={`/${this.props.region.regionId}/networks/create`}>
                        <i className="fa fa-refresh"></i>
                      </Link>
                    </div>
                    <div className="filter-item inline labels-filter">
                      <div className="dropdown">
                        <button className="dropdown-menu-toggle js-label-select js-filter-submit js-multiselect js-extra-options" data-default-label="Label" data-field-name="label_name[]" data-labels="/root/awesome/labels.json" data-project-id="1" data-show-any="true" data-show-no="true" data-toggle="dropdown" type="button">
                          <span className="dropdown-toggle-text">Label</span>
                          <i className="fa fa-chevron-down"></i>
                        </button>
                        <div className="dropdown-menu dropdown-select dropdown-menu-paging dropdown-menu-labels dropdown-menu-selectable">
                          <div className="dropdown-page-one">
                            <div className="dropdown-title">
                              <span>Filter by label</span>
                              <button className="dropdown-title-button dropdown-menu-close" aria-label="Close" type="button">
                                <i className="fa fa-times dropdown-menu-close-icon"></i>
                              </button>
                            </div>
                            <div className="dropdown-input">
                              <input type="search" id="" className="dropdown-input-field" placeholder="Search labels" value="" />
                              <i className="fa fa-search dropdown-input-search"></i>
                              <i role="button" className="fa fa-times dropdown-input-clear js-dropdown-input-clear"></i>
                            </div>
                            <div className="dropdown-content"></div>
                            <div className="dropdown-footer">
                              <ul className="dropdown-footer-list">
                                <li>
                                  <a className="dropdown-toggle-page" href="#">Create new</a></li>
                                <li>
                                  <a data-is-link="true" href="/root/awesome/labels">Manage labels</a></li>
                              </ul>
                            </div>
                            <div className="dropdown-loading">
                              <i className="fa fa-spinner fa-spin"></i>
                            </div>
                          </div>
                          <div className="dropdown-page-two dropdown-new-label">
                            <div className="dropdown-title">
                              <button className="dropdown-title-button dropdown-menu-back" aria-label="Go back" type="button">
                                <i className="fa fa-arrow-left"></i>
                              </button>
                              <span>Create new label</span>
                              <button className="dropdown-title-button dropdown-menu-close" aria-label="Close" type="button">
                                <i className="fa fa-times dropdown-menu-close-icon"></i>
                              </button>
                            </div>
                            <div className="dropdown-content">
                              <input className="default-dropdown-input" id="new_label_name" placeholder="Name new label" type="text" />
                              <div className="suggest-colors suggest-colors-dropdown">
                                <a data-color="#0033CC" href="#">&nbsp;</a>
                                <a data-color="#428BCA" href="#">&nbsp;</a>
                                <a data-color="#CC0033" href="#">&nbsp;</a>
                                <a data-color="#FF0000" href="#">&nbsp;</a>
                                <a data-color="#D9534F" href="#">&nbsp;</a>
                                <a data-color="#D1D100" href="#">&nbsp;</a>
                                <a data-color="#F0AD4E" href="#">&nbsp;</a>
                                <a data-color="#AD8D43" href="#">&nbsp;</a></div>
                              <div className="dropdown-label-color-input">
                                <div className="dropdown-label-color-preview js-dropdown-label-color-preview"></div>
                                <input className="default-dropdown-input" id="new_label_color" type="text" /></div>
                              <div className="clearfix">
                                <button className="btn btn-primary pull-left js-new-label-btn disabled" type="button" disabled="disabled">Create</button>
                                <button className="btn btn-default pull-right js-cancel-label-btn" type="button">Cancel</button></div>
                            </div>
                          </div>
                          <div className="dropdown-loading">
                            <i className="fa fa-spinner fa-spin"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="filter-item inline">
                      <form className="search-form">
                        <input type="search" name="issue_search" placeholder="Filter by name ..." className="form-control issue_search search-text-input input-short" spellCheck="false" value="" />
                      </form>
                    </div>
                    <div className="pull-right">
                      <div className="dropdown inline prepend-left-10">
                        <button className="dropdown-toggle btn" data-toggle="dropdown" type="button">
                          <span className="light"></span>最新创建
                          <b className="caret"></b></button>
                        <ul className="dropdown-menu dropdown-menu-align-right">
                          <li>
                            <a href="/root/awesome/issues?assignee_id=&amp;author_id=&amp;milestone_title=&amp;scope=all&amp;sort=id_desc&amp;state=closed">Last created</a>
                            <a href="/root/awesome/issues?assignee_id=&amp;author_id=&amp;milestone_title=&amp;scope=all&amp;sort=id_asc&amp;state=closed">Oldest created</a>
                            <a href="/root/awesome/issues?assignee_id=&amp;author_id=&amp;milestone_title=&amp;scope=all&amp;sort=updated_desc&amp;state=closed">Last updated</a>
                            <a href="/root/awesome/issues?assignee_id=&amp;author_id=&amp;milestone_title=&amp;scope=all&amp;sort=updated_asc&amp;state=closed">Oldest updated</a>
                            <a href="/root/awesome/issues?assignee_id=&amp;author_id=&amp;milestone_title=&amp;scope=all&amp;sort=milestone_due_asc&amp;state=closed">Milestone due soon</a>
                            <a href="/root/awesome/issues?assignee_id=&amp;author_id=&amp;milestone_title=&amp;scope=all&amp;sort=milestone_due_desc&amp;state=closed">Milestone due later</a>
                            <a href="/root/awesome/issues?assignee_id=&amp;author_id=&amp;milestone_title=&amp;scope=all&amp;sort=due_date_asc&amp;state=closed">Due soon</a>
                            <a href="/root/awesome/issues?assignee_id=&amp;author_id=&amp;milestone_title=&amp;scope=all&amp;sort=due_date_desc&amp;state=closed">Due later</a>
                            <a href="/root/awesome/issues?assignee_id=&amp;author_id=&amp;milestone_title=&amp;scope=all&amp;sort=upvotes_desc&amp;state=closed">Most popular</a>
                            <a href="/root/awesome/issues?assignee_id=&amp;author_id=&amp;milestone_title=&amp;scope=all&amp;sort=downvotes_desc&amp;state=closed">Least popular</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </form>
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
                    <th width="200">{t('created')}</th>
                  </tr>
                </thead>
                <tbody>
                {networks}
                </tbody>
              </table>
            </div>
            <div className="gl-pagination">
              <ul className="pagination clearfix">
                <li className="prev disabled">
                  <span>Prev</span></li>
                <li className="page active">
                  <a href="/root/awesome/issues?scope=all&amp;sort=id_asc&amp;state=closed&amp;utf8=%E2%9C%93">1</a></li>
                <li className="page">
                  <a rel="next" href="/root/awesome/issues?page=2&amp;scope=all&amp;sort=id_asc&amp;state=closed&amp;utf8=%E2%9C%93">2</a></li>
                <li className="next">
                  <a rel="next" href="/root/awesome/issues?page=2&amp;scope=all&amp;sort=id_asc&amp;state=closed&amp;utf8=%E2%9C%93">Next</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
