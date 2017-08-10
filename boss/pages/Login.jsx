import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';
import Header from '../../shared/components/Header';
import Notify from '../../shared/components/Notify.jsx';
import LoginForm from '../../shared/forms/LoginForm';

class C extends React.Component {

  componentDidMount() {
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const email = values.email;
      const password = values.password;

      dispatch(Actions.requestLogin(email, password))
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
    });
  }

  render() {
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
                        <LoginForm onSubmit={this.onSubmit} />
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
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(C);
