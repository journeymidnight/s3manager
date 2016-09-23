import React from 'react';
import cookie from 'js-cookie';
import Page, { attach } from '../../shared/pages/Page';
import Auth from '../../console-common/services/auth';
import * as Actions from '../../console-common/redux/actions';

class C extends Page {

  componentDidMount() {
    const { dispatch } = this.props;

    const sessionId = cookie.get('oauth_session_id');

    Auth.oAuthAccess(sessionId)
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
      if (error.retCode === 4110) {
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
                    发送邮件
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
