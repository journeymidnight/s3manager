import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';
import Header from '../../shared/components/Header';
import Notify from '../../shared/components/Notify.jsx';
import Auth from '../../boss/services/auth';
import LoginForm from '../../shared/forms/LoginForm';
import { push } from 'react-router-redux';


class C extends React.Component {

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
        let auth
        //actually there is only one root
        if (token.type === "ROOT") {
          auth = {username: "u-root"};
        } else {
          auth = {username: token.accountId};
        }

        var context = {};
        context.auth = auth
        dispatch(Actions.authLogin(context, token.token));
        if (token.type === 'ROOT') {
          dispatch(push('/users')) 
        } else {
          //for accounts, we should let them select a project right now
          //if 
          var region = { //fixme: this is ugly
            accessKey:  "tjhKTEkZ6wzteqYNPvas",
            accessSecret: "VLZsBahNvgsC9x5mfsRgUhwgn4HPyPV4JaAaSzNZ",
            endpoint: "http://127.0.0.1:8888",
            name: "华北一区",
            regionId: "cn-north-1"
          };
          dispatch(Actions.selectService({
            serviceKey: '',
            servicePath: '',
            region
          }));

          dispatch(push('/buckets')) 
        }
      })
      .catch((error) => {
        reject();
        if (error.retCode === 1200) {
          dispatch(Actions.notifyAlert(i18n.t('authorizeFailed')));
        } else if (error.retCode === 4102) {
          dispatch(Actions.extendContext({ projectSet: error.data.projectSet}))
          dispatch(push('/login')) 
        } else {
          dispatch(Actions.notifyAlert(error.message));
        }
      });
    });
  }

  render() {
    debugger
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
                  对象存储管理系统
                </h1>
                <p>
                  提供高速、海量的存储服务，助力企业发展
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
                        <LoginForm onSubmit={this.onSubmit} projects={this.props.context.projectSet} initialValues={this.initialValues}/>
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

C.propTypes = {
  auth: React.PropTypes.object,
  context: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    context: state.context,
  };
}

export default connect(mapStateToProps)(C);
