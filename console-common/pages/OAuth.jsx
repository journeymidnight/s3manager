import React from 'react';
import cookie from 'js-cookie';
import Page, { attach } from '../../shared/pages/Page';
import Auth from '../../console-common/services/auth';
import * as Actions from '../../console-common/redux/actions';
import * as Validations from '../../shared/utils/validations';
import Form, { attach as attachForm } from '../../shared/components/Form';

class F extends Form {

  static fields = ['projectId'];

  static validate(values) {
    const errors = {};
    errors.projectId = Validations.required(values.projectId);
    return errors;
  }

  render() {
    const {
      fields: { projectId },
      projectSet,
      handleSubmit,
      submitting,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <section id="content">
          <div>
            <section className="hero" style={{ margin: '200px 0 50px' }}>
              <div className="col-md-6 col-md-offset-5">
                <img src="/asset/logo.svg" alt="logo" style={{ position: 'absolute', width: '60px', left: '-80px', top: '10px' }} />
                <h5>选择需要登陆的项目</h5>
                <p>
                  <select
                    className="form-control"
                    value={projectId.value}
                    onBlur={projectId.onBlur}
                    onChange={projectId.onChange}
                    onDragStart={projectId.onDragStart}
                    onDrop={projectId.onDrop}
                    onFocus={projectId.onFocus}
                  >
                    {projectSet.map((project) => {
                      return <option value={project.projectId} key={project.projectId}>{project.name}</option>;
                    })}
                  </select>
                </p>
                <button type="submit" className="btn btn-save" disabled={submitting}>
                  登陆
                </button>
              </div>
            </section>
          </div>
        </section>
      </form>
    );
  }
}

const LoginForm = attachForm(F);

class C extends Page {

  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  componentDidMount() {
    this.login();
  }

  onLogin(values) {
    const projectId = values.projectId;

    this.login(projectId);
  }

  login(projectId) {
    const { dispatch } = this.props;
    const sessionId = cookie.get('oauth_session_id');

    Auth.oAuthAccess(sessionId, projectId)
    .promise
    .then((token) => {
      Auth.describeToken(token.token)
      .promise
      .then((context) => {
        dispatch(Actions.authLogin(context, token));
        window.location.hash = '#/';
      })
      .catch((error) => {
        dispatch(Actions.notifyAlert(error.message));
      });
    }).catch((error) => {
      if (error.retCode === 4110 || error.retCode === 4104) {
        dispatch(Actions.extendContext({
          inActive: true,
        }));
      } else if (error.retCode === 4102) {
        dispatch(Actions.extendContext({
          projectSet: error.data.projectSet,
        }));
      } else {
        dispatch(Actions.notifyAlert(error.message));
      }
    });
  }

  render() {
    return (
      <div>
        {this.props.context.projectSet && <div className="container">
          <LoginForm onSubmit={this.onLogin} projectSet={this.props.context.projectSet} initialValues={{ projectId: this.props.context.projectSet[0].projectId }} />
        </div>}
        {this.props.context.inActive && <div className="container">
          <section id="content">
            <div>
              <section className="hero" style={{ margin: '200px 0 50px' }}>
                <div className="col-md-6 col-md-offset-5">
                  <img src="/asset/logo.svg" alt="logo" style={{ position: 'absolute', width: '60px', left: '-80px', top: '10px' }} />
                  <h5>用户尚未授权此服务</h5>
                  <p>
                    请发送邮件给管理员开通权限。<br />
                    或拨打客服电话 400-055-6060 。
                  </p>
                  <a href="mailto:zhangzhenyao@le.com?subject=开通云主机账号权限" className="btn btn-success">
                    开通权限
                  </a>
                  &nbsp;
                  <a href="http://lecloud.com" className="btn btn-info">
                    回到官网
                  </a>
                </div>
              </section>
            </div>
          </section>
        </div>}
      </div>
    );
  }
}

export default attach(C);
