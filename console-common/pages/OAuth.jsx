import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import Auth from '../../console-common/services/auth';
import * as Actions from '../../console-common/redux/actions';

class C extends Page {

  componentDidMount() {
    const { dispatch } = this.props;

    const sessionId = window.$.cookie('lecloud_uc_jsessionid');

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
      if (error.retCode === 4102) {
        // TODO
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
      </div>
    );
  }
}

export default attach(C);
