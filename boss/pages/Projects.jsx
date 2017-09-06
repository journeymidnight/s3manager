import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import ButtonForm from '../../shared/forms/ButtonForm';
import SearchBox from '../../shared/components/SearchBox';
import StatusFilter from '../../shared/components/StatusFilter';
import * as ProjectActions from '../redux/actions.project';
import * as Actions from '../redux/actions';

class C extends TablePage {

  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  initialize(routerKey) {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('projectManage'), '/projects'));

    this.initTable(routerKey, {
      status: ['active'],
    });
  }

  refreshAction(routerKey, filters) {
    return ProjectActions.requestDescribeProjects(routerKey, filters);
  }

  onDelete() {
    const { dispatch, routerKey } = this.props;
    const projectIds = _.keys(this.props.context.selected);

    return new Promise((resolve, reject) => {
      dispatch(ProjectActions.requestDeleteProjects(routerKey, projectIds))
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
    return this.props.context.total > 0 && this.props.context.projectSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.projectSet.map((u) => { return u.projectId; }))} />
            </th>
            <th width="30%">{t('id')}</th>
            <th>{t('name')}</th>
            <th width="30%">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.context.projectSet.map((project) => {
          return (
            <tr key={project.projectId}>
              <td>
                <input type="checkbox" className="selected" onChange={this.onSelect(project.projectId)} checked={this.props.context.selected[project.projectId] === true} />
              </td>
              <td>
                <Link to={`/projects/${project.projectId}`}>
                  {project.projectId}
                </Link>
              </td>
              <td><strong>{project.projectName}</strong></td>
              <td>{moment.utc(project.created).local().format('YYYY-MM-DD HH:mm:ss')}</td>
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
          <span>
            {t('projectManageDescription')}
          </span>
        </div>
        <div className="nav-controls">
          <Link className="btn btn-new" to="/projects/create">
            <i className="fa fa-plus"></i>&nbsp;{t('create')}
          </Link>
        </div>
      </div>
    );
  }

  renderFilters() {
    const { t } = this.props;
    const statusOption = [{
      status: ['active'],
      name: t('projectStatus.active'),
    }, {
      status: ['deleted'],
      name: t('projectStatus.deleted'),
    }];
    return (
      <div className="gray-content-block second-block">
        <div className={Object.keys(this.props.context.selected).length > 0 ? 'hidden' : ''}>
          <div className="filter-item inline">
            <a className="btn btn-default" onClick={this.onRefresh({}, false)}>
              <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
            </a>
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
