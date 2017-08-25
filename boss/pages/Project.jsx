import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import * as ProjectActions from '../redux/actions.project';

class C extends Page {

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('projectManage'), '/projects'));
  }

  refresh() {
    const { params, dispatch } = this.props;
    this.projectId = params.projectId;
    dispatch(ProjectActions.requestDescribeProject(this.projectId))
    .then(() => {
      this.project = this.props.context.project;
    });
  }

  render() {
    const { t, params } = this.props;

    if (!this.props.context.project || this.props.context.project.projectId !== params.projectId) {
      this.refresh();

      return <div />;
    }

    const project = this.props.context.project;
    let active = 'basic';
    if (_.endsWith(this.props.location.pathname, 'users')) {
      active = 'users';
    } else if (_.endsWith(this.props.location.pathname, 'basic')) {
      active = 'basic';
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                <i>{this.props.context.project.projectId}</i>
              </div>

              <ul className="nav-links pull-right">
                <li className={`pull-right ${(active === 'users') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/projects/${this.props.context.project.projectId}/users`}>
                    {t('pageProject.authorizedUsers')}
                  </Link>
                </li>
                <li className={`pull-right ${(active === 'basic') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/projects/${this.props.context.project.projectId}/basic`}>
                    {t('pageProject.basic')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              {React.cloneElement(this.props.children, { project })}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
