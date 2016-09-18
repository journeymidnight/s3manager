import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import Auth from '../../console-common/services/auth';
import * as Actions from '../../console-common/redux/actions';

class C extends Page {

  componentDidMount() {
    const { dispatch } = this.props;

    Auth.oAuthAccess()
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
    const { t } = this.props;
    return (
      <div>
        {this.props.context.inActive && <div className="container">
          <h3>{t('inActivedUser')}</h3>
        </div>}
      </div>
    );
  }
}

export default attach(C);
