import React from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import LoginForm from '../forms/LoginForm';

const C = () => {
  return (
    <div className="login-page">
      <Header />
      <div className="container navless-container">
        <div className="content">
          <div className="row">
            <div className="col-sm-5 pull-right">
              <div>
                <div className="prepend-top-20">
                  <div className="login-box">
                    <div className="login-heading">
                      <h3>
                        请登陆
                      </h3>
                    </div>
                    <div className="login-body">
                      <LoginForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-7 brand-holder pull-left">
              <h1>
                LeStack
              </h1>
              <p>
                乐视云商业化基础设施云服务 ( LeStack )，提供计算、存储、网络等资源的企业级 IaaS 解决方案, 让企业按需使用高效稳定的云资源，加速产品迭代。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

C.propTypes = {
  auth: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(C);
