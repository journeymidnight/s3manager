import React from 'react';
import _ from 'lodash';
import Page from './Page';
import Pagination from '../components/Pagination';
import * as Actions from '../redux/actions';

class C extends Page {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
    this.isAllSelected = this.isAllSelected.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
    this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
  }

  // need inherit
  refreshAction() {
  }

  initialize(routerKey, reInit = false) {
    return reInit;
  }

  initTable(routerKey, options) {
    const { dispatch } = this.props;

    const context = {
      selected: {},
      currentPage: 1,
      size: 20,
      reverse: true,
      searchWord: null,
      isTabPage: false,
    };
    dispatch(Actions.extendContext(Object.assign(context, options), routerKey));

    setTimeout(this.onRefresh(), 100);

    this.setInterval(this.onRefresh({}, false, true), 20000);
  }

  refresh(silent = true) {
    const { dispatch, routerKey } = this.props;

    if (this.props.context.currentPage === undefined) {
      return;
    }

    const filters = {
      offset: (this.props.context.currentPage - 1) * this.props.context.size,
      limit: this.props.context.size,
      status: this.props.context.status,
      reverse: this.props.context.reverse,
      searchWord: this.props.context.searchWord,
    };

    dispatch(this.refreshAction(routerKey, filters))
    .then(() => {
      if (!silent) {
        dispatch(Actions.extendContext({ loading: false, initialized: true }, routerKey));
      } else {
        dispatch(Actions.extendContext({ initialized: true }, routerKey));
      }
    })
    ;

    if (!silent) {
      dispatch(Actions.extendContext({ loading: true }, routerKey));
    }
  }

  onRefresh(overideFilters = {}, firstPage = true, silent = false) {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      if (firstPage) {
        overideFilters.currentPage = 1;
      }

      if (!silent) {
        overideFilters.selected = {};
      }

      const { dispatch, routerKey } = this.props;
      dispatch(Actions.extendContext(overideFilters, routerKey));

      setTimeout(() => {
        this.refresh(silent);
      }, 100);
    };
  }

onSelect(id) {
  return (isChecked) => {
    const selected = Object.assign({}, this.props.context.selected);
    if (isChecked) {
      selected[id] = true;
    } else {
      delete selected[id];
    }

    const { dispatch, routerKey } = this.props;
    dispatch(Actions.extendContext({ selected }, routerKey));
  };
}

//  onSelect(id) {
//    return (e) => {
//      const selected = Object.assign({}, this.props.context.selected);
//      if (e.target.checked) {
//        selected[id] = true;
//      } else {
//        delete selected[id];
//      }
//
//      const { dispatch, routerKey } = this.props;
//      dispatch(Actions.extendContext({ selected }, routerKey));
//    };
//  }


  onSelectAll(ids) {
    return (isChecked) => {
      const selected = Object.assign({}, this.props.context.selected);
      ids.forEach((id) => {
        if (isChecked) {
          selected[id] = true;
        } else {
          delete selected[id];
        }
      });

      const { dispatch, routerKey } = this.props;
      dispatch(Actions.extendContext({ selected }, routerKey));
    };
  }

  isAllSelected(allIds) {
    return allIds.length && !allIds.filter((id) => {
      return this.props.context.selected[id] !== true;
    }).length;
  }

  isBatchActionDisabled(availabeStatuss, resourceSet, resourceIdName) {
    const selectedIds = _.keys(this.props.context.selected);
    const unavailabeResources = resourceSet.filter((resource) => {
      return selectedIds.indexOf(resource[resourceIdName]) > -1 && availabeStatuss.indexOf(resource.status) === -1;
    });

    return !!unavailabeResources.length;
  }

  doSearch() {
    let searchWord = this.refs.searchBox.refs.search.value.trim();
    if (_.isEmpty(searchWord)) {
      searchWord = null;
    }
    this.onRefresh({ searchWord })();
  }

  onSearchKeyPress(e) {
    if (e.key === 'Enter') {
      this.doSearch();
    }
  }

  onSearchButtonClick() {
    this.doSearch();
  }

  renderHeader() {
    return <div />;
  }

  renderFilters() {
    return <div />;
  }

  renderTable() {
    return <div />;
  }

  renderPagination() {
    const { offset, limit, total } = this.props.context;
    return (
      <div>
        {this.props.context.total > 0 && (
          <Pagination
            total={total}
            onRefresh={this.onRefresh}
            currentPage={parseInt(offset / limit, 10) + 1}
            totalPage={parseInt((total - 1) / limit, 10) + 1}
          />
        )}
      </div>
    );
  }

  renderAfterInitialized() {
    const { t } = this.props;
    const { isTabPage } = this.props.context;
    return (
      <div className={isTabPage ? '' : 'container-fluid container-limited'}>
        <div className="content">
          <div className="clearfix">

            {this.renderHeader()}
            {this.renderFilters()}

            <div className="table-holder">
              {this.renderTable() || <div className="nothing-here-block">{t('nothingHere')}</div>}
            </div>

            {this.renderPagination()}
          </div>
        </div>
      </div>
    );
  }
}

export default C;
