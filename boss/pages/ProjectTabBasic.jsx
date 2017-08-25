import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import ProjectForm from '../forms/ProjectForm';
import * as ProjectActions from '../redux/actions.project';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSave = this.onSave.bind(this);
  }

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('projectManage'), '/projects'));
  }

  onSave(values, dispatch) {
    return new Promise((resolve, reject) => {
      const projectName = values.projectName;
      const description = values.description;

      dispatch(ProjectActions.requestModifyProject({
        projectId: this.props.project.projectId,
        projectName,
        description,
      }))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  render() {
    const { t, project } = this.props;
    return (
      <div className="panel panel-default prepend-top-20">
        <div className="panel-heading">{t('settings')}</div>
        <div className="panel-body">
          <ProjectForm initialValues={project} onSubmit={this.onSave} />
        </div>
      </div>
    );
  }
}

export default attach(C);
