import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import Header from '../../shared/components/Header';
import * as Actions from '../../console-common/redux/actions';
import Auth from '../../console-common/services/auth';
import Notify from '../../shared/components/Notify.jsx';
import LoginForm from '../../shared/forms/LoginForm';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.initialValues = {};
  }

  onSubmit(values, dispatch) {
    this.initialValues = values;

    return new Promise((resolve, reject) => {
      const email = values.email;
      const password = values.password;
      const projectId = values.projectId;

      Auth.authorize(email, password, projectId)
      .promise
      .then((token) => {
        Auth.describeToken(token.token)
        .promise
        .then((context) => {
          resolve();
          dispatch(Actions.authLogin(context, token));
          dispatch(push('/'));
        })
        .catch((error) => {
          reject();
          dispatch(Actions.notifyAlert(error.message));
        });
      }).catch((error) => {
        reject();
        if (error.retCode === 1402) {
          dispatch(Actions.extendContext({
            projectSet: error.data.projectSet,
          }));
        } else {
          dispatch(Actions.notifyAlert(error.message));
        }
      });
    });
  }

  render() {
    if (this.props.context.projectSet && this.props.context.projectSet.length > 0 && !this.initialValues.projectId) {
      this.initialValues.projectId = this.props.context.projectSet[0].projectId;
    }
    return (
      <div className="login-page">
        <Header />
        <div className="container navless-container">
          <Notify />
          <div className="content">
            <div className="row">
              <div className="col-sm-7 brand-holder">
                <h1>
                  LeCloud IaaS
                </h1>
                <p>
                  乐视云商业化基础设施云服务，提供计算、存储、网络等资源的企业级 IaaS 解决方案, 让企业按需使用高效稳定的云资源，加速产品迭代。
                </p>
              </div>
              <div className="col-sm-5">
                <div>
                  <div className="prepend-top-20">
                    <div className="login-box">
                      <div className="login-heading">
                        <h3>
                          请登陆
                        </h3>
                      </div>
                      <div className="login-body">
                        <LoginForm onSubmit={this.onSubmit} projects={this.props.context.projectSet} initialValues={this.initialValues} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
