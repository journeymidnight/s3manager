import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';
import * as KeyPairActions from '../redux/actions.key_pair';

class C extends RegionPage {

  constructor(props) {
    super(props);

    this.state = {
      status: ['pending', 'active'],
      selected: {
      },
      currentPage: 1,
      size: 2,
      reverse: true,
      searchWord: null,
      loading: true,
    };
    this.refresh = this.refresh.bind(this);
    // this.onSelect = this.onSelect.bind(this);
    // this.onSelectAll = this.onSelectAll.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('keyPairManage'), `/${region.regionId}/key_pairs`));
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

  onRefresh() {
    const { dispatch, region, routerKey } = this.props;

    const filters = {
      offset: (this.state.currentPage - 1) * this.state.size,
      limit: this.state.size,
      status: this.state.status,
      reverse: this.state.reverse,
      searchWord: this.state.searchWord,
    };
    dispatch(KeyPairActions.requestDescribeKeyPairs(routerKey, region.regionId, filters))
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

  deleteKeyPair() {
    const { dispatch, region, routerKey } = this.props;
    dispatch(KeyPairActions.requestDeleteKeyPairs(routerKey, region.regionId));
  }

  render() {
    const keyPairs = this.props.context.keyPairSet && this.props.context.keyPairSet.map((keyPair) => {
      return (
        <tr key={keyPair.keyPairId}>
          <td>{keyPair.keyPairId}</td>
          <td>
            <Link to={`/${this.props.region.regionId}/key_pairs/${keyPair.keyPairId}`}>
              <strong>
                {keyPair.name}
              </strong>
            </Link>
          </td>
          <td className="light">{keyPair.created}</td>
          <td><button onClick={() => this.deleteKeyPair(keyPair)}>delete </button></td>
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
                  {t('keyPairManageDescription')}
                </p>
              </div>
              <div className="nav-controls">
                <Link className="btn btn-new" to={`/${this.props.region.regionId}/key_pairs/create`}>
                  <i className="fa fa-plus"></i>&nbsp; {t('create')}
                </Link>
              </div>
            </div>
            <div className="gray-content-block second-block">
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
          </div>
          <div>
            <div className="table-holder">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('id')}</th>
                    <th>{t('name')}</th>
                    <th>{t('created')}</th>
                    <th>operation</th>
                  </tr>
                </thead>
                <tbody>
                  {keyPairs}
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
                {this.props.context.currentPage < this.props.context.pageCount && <li>
                  <a href onClick={this.refresh({ currentPage: this.props.context.currentPage + 1 }, false)}>
                    {this.props.context.currentPage + 1}
                  </a>
                </li>}
                {this.props.context.currentPage < this.props.context.pageCount && <li>
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
