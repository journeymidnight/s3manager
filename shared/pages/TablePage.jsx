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
    this.onRefresh = this.onRefresh.bind(this);
    this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
  }

  // need inherit
  refreshAction() {
  }

  initTable(initStatus = ['pending', 'active']) {
    const { dispatch, routerKey } = this.props;

    dispatch(Actions.extendContext({
      status: initStatus,
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
    const { dispatch, routerKey } = this.props;

    const filters = {
      offset: (this.props.context.currentPage - 1) * this.props.context.size,
      limit: this.props.context.size,
      status: this.props.context.status,
      reverse: this.props.context.reverse,
      searchWord: this.props.context.searchWord,
    };

    dispatch(this.refreshAction(routerKey, filters))
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

  onSelect(id) {
    return (e) => {
      const selected = this.props.context.selected;
      if (e.target.checked) {
        selected[id] = true;
      } else {
        delete selected[id];
      }

      const { dispatch, routerKey } = this.props;
      dispatch(Actions.extendContext({ selected }, routerKey));
    };
  }

  onSelectAll(ids) {
    return (e) => {
      const selected = this.props.context.selected;
      ids.forEach((id) => {
        if (e.target.checked) {
          selected[id] = true;
        } else {
          delete selected[id];
        }
      });

      const { dispatch, routerKey } = this.props;
      dispatch(Actions.extendContext({ selected }, routerKey));
    };
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

  renderHeader() {
    return <div />;
  }

  renderFilters() {
    return <div />;
  }

  renderTable() {
    return <div />;
  }

  renderAfterInitialized() {
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">

            {this.renderHeader()}

            {this.renderFilters()}

            <div className="table-holder">
              {this.renderTable() || <div className="nothing-here-block">{t('nothingHere')}</div>}
            </div>

            {this.props.context.total > 0 && (
              <Pagination
                onRefresh={this.onRefresh}
                currentPage={this.props.context.currentPage}
                totalPage={this.props.context.totalPage}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default C;
