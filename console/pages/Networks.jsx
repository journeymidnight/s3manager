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
      selected: {
      },
      currentPage: 1,
      size: 20,
      reverse: true,
      searchWord: null,
      loading: true,
    };
    this.refresh = this.refresh.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
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
      overideFilters.selected = {};
      this.setState(Object.assign(this.state, overideFilters));
      this.onRefresh();
    };
  }

  onSelect(item) {
    return (e) => {
      const selected = this.state.selected;
      if (e.target.checked) {
        selected[item.networkId] = true;
      } else {
        delete selected[item.networkId];
      }
      this.setState(Object.assign(this.state, { selected }));
    };
  }

  onSelectAll(e) {
    const selected = this.state.selected;
    this.props.context.networkSet.forEach((item) => {
      if (e.target.checked) {
        selected[item.networkId] = true;
      } else {
        delete selected[item.networkId];
      }
    });
    this.setState(Object.assign(this.state, { selected }));
  }

  onRefresh() {
    const { dispatch, region, routerKey } = this.props;

    const filters = {
      currentPage: this.state.currentPage,
      size: this.state.size,
      status: this.state.status,
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
            <input type="checkbox" className="selected" onChange={this.onSelect(network)} checked={this.state.selected[network.networkId] === true} />
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
            <div className="gray-content-block second-block">
              <div className={Object.keys(this.state.selected).length > 0 ? 'hidden' : ''}>
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
                              <a className={this.state.status.toString() === filter.status.toString() ? 'is-active' : ''} href onClick={this.refresh({ status: filter.status })}>
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
                      <span className="light"></span> {this.state.reverse ? t('lastCreated') : t('firstCreated')}
                      <b className="caret"></b></button>
                    <ul className="dropdown-menu dropdown-menu-align-right dropdown-select dropdown-menu-selectable">
                      <li><a className={this.state.reverse ? 'is-active' : ''} href onClick={this.refresh({ reverse: true })}>{t('lastCreated')}</a></li>
                      <li><a className={this.state.reverse ? '' : 'is-active'} href onClick={this.refresh({ reverse: false })}>{t('firstCreated')}</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={Object.keys(this.state.selected).length > 0 ? '' : 'hidden'}>
                <div className="filter-item inline">
                  <a className="btn btn-danger">{t('delete')}</a>
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
