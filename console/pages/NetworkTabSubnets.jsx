import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { attach } from '../../shared/pages/Page';
import { confirmModal } from '../../shared/components/Modal';
import { buttonForm } from '../../shared/forms/ButtonForm';
import TablePage from '../../shared/pages/TablePage';
import SubnetCreateForm from '../forms/SubnetCreateForm';
import * as Actions from '../redux/actions';
import * as NetworkActions from '../redux/actions.network';


class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onCreateSubnet = this.onCreateSubnet.bind(this);
    this.showCreatePanel = this.showCreatePanel.bind(this);

    this.state = {
      showCreatePanel: false,
    };
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), `/${region.regionId}/networks`));

    this.initTable({
      status: ['active'],
      isTabPage: true,
    });
  }

  refreshAction(routerKey, filters) {
    const { region, network } = this.props;
    filters.networkIds = [network.networkId];
    return NetworkActions.requestDescribeSubnets(routerKey, region.regionId, filters);
  }

  onDelete() {
    const { t } = this.props;

    confirmModal(t('confirmDelete'), () => {
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

  showCreatePanel(e) {
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
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.subnetSet.map((u) => { return u.subnetId; }))} />
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
                <input type="checkbox" className="selected" onChange={this.onSelect(subnet.subnetId)} checked={this.props.context.selected[subnet.subnetId] === true} />
              </td>
              <td>{subnet.subnetId}</td>
              <td>
                {subnet.cidr}
              </td>
              <td>{moment.utc(subnet.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
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
      <div>
        <div className="top-area">
          <div className="nav-text">
            <span className="light">
              {t('subnetManageDescription')}
            </span>
          </div>
          <div className="nav-controls">
            <a className="btn btn-new" href onClick={this.showCreatePanel}>
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
        {Object.keys(this.props.context.selected).length > 0 && <div>
          <div className="filter-item inline">
            {buttonForm({ onSubmit: this.onDelete, text: t('delete'), type: 'btn-danger' })}
          </div>
        </div>}
      </div>
    );
  }
}

export default attach(C);
