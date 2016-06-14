import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import Pagination from '../../shared/components/Pagination';
import SubnetCreateForm from '../forms/SubnetCreateForm';
import * as Actions from '../redux/actions';
import * as NetworkActions from '../redux/actions.network';

let SubnetsDeleteForm = (props) => {
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

SubnetsDeleteForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

SubnetsDeleteForm = reduxForm({
  form: 'SubnetsDeleteForm',
  fields: [],
})(translate()(SubnetsDeleteForm));

class C extends RegionPage {

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onCreateSubnet = this.onCreateSubnet.bind(this);
    this.onShowCreatePanel = this.onShowCreatePanel.bind(this);

    this.state = {
      showCreatePanel: false,
    };
  }

  componentDidMount() {
    const { dispatch, routerKey } = this.props;

    dispatch(Actions.extendContext({
      selected: {
      },
      currentPage: 1,
      size: 20,
      reverse: true,
    }, routerKey));

    setTimeout(this.onRefresh(), 100);
  }

  refresh() {
    const { dispatch, region, routerKey, network } = this.props;

    const filters = {
      offset: (this.props.context.currentPage - 1) * this.props.context.size,
      limit: this.props.context.size,
      status: ['active'],
      reverse: this.props.context.reverse,
      networkIds: [network.networkId],
    };
    dispatch(NetworkActions.requestDescribeSubnets(routerKey, region.regionId, filters))
    .then(() => {
      dispatch(Actions.extendContext({
        loading: false,
        initialized: true,
      },
      routerKey));
    });
    dispatch(Actions.extendContext({
      loading: true,
    }, routerKey));
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
        selected[item.subnetId] = true;
      } else {
        delete selected[item.subnetId];
      }

      const { dispatch, routerKey } = this.props;
      dispatch(Actions.extendContext({ selected }, routerKey));
    };
  }

  onSelectAll(e) {
    const selected = this.props.context.selected;
    this.props.context.subnetSet.forEach((item) => {
      if (e.target.checked) {
        selected[item.subnetId] = true;
      } else {
        delete selected[item.subnetId];
      }
    });

    const { dispatch, routerKey } = this.props;
    dispatch(Actions.extendContext({ selected }, routerKey));
  }

  onDelete() {
    const { dispatch, region, routerKey } = this.props;
    const subnetIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(NetworkActions.requestDeleteSubnets(routerKey, region.regionId, subnetIds))
      .then(() => {
        resolve();
        this.onRefresh({}, false)();
      }).catch(() => {
        reject();
      });
    });
  }

  onCreateSubnet(values) {
    const { dispatch, region, routerKey, network } = this.props;

    return new Promise((resolve, reject) => {
      const cidr = values.cidr;

      dispatch(NetworkActions.requestCreateSubnet(routerKey, region.regionId, {
        networkId: network.networkId,
        cidr,
      }))
      .then(() => {
        resolve();
        this.onRefresh({}, false)();
      }).catch(() => {
        reject();
      });
    });
  }

  onShowCreatePanel(e) {
    e.preventDefault();
    this.setState({ showCreatePanel: true });
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.subnetSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('cidr')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.subnetSet.map((subnet) => {
          return (
            <tr key={subnet.subnetId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(subnet)} checked={this.props.context.selected[subnet.subnetId] === true} />
              </td>
              <td>{subnet.subnetId}</td>
              <td>
                {subnet.cidr}
              </td>
              <td className="light">{subnet.created}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }

  renderAfterInitialized() {
    const { t } = this.props;
    return (
      <div className="content">
        <div className="clearfix">
          <div className="top-area">
            <div className="nav-text">
              <span className="light">
                {t('subnetManageDescription')}
              </span>
            </div>
            <div className="nav-controls">
              <a className="btn btn-new" href onClick={this.onShowCreatePanel}>
                <i className="fa fa-plus"></i>&nbsp;{t('create')}
              </a>
            </div>
          </div>
          {this.state.showCreatePanel && <div className="panel panel-primary">
            <div className="panel-heading">{t('pageNetwork.createSubnet')}</div>
            <div className="panel-body">
              <SubnetCreateForm onSubmit={this.onCreateSubnet} />
            </div>
          </div>}
          <div className="gray-content-block second-block">
            <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
              <div className="filter-item inline">
                <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
                  <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
                </a>
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
                <SubnetsDeleteForm onSubmit={this.onDelete} />
              </div>
            </div>
          </div>
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
    );
  }

  render() {
    if (!this.props.context || !this.props.context.initialized) {
      return <div />;
    }

    return this.renderAfterInitialized();
  }
}

export default attach(C);
