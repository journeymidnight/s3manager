import React from 'react';
import { push } from 'react-router-redux';
import Page, { attach } from '../../shared/pages/Page';
import KeyPairForm from '../forms/KeyPairForm';
import { notify, notifyAlert } from '../../console-common/redux/actions';
import * as KeyPairActions from '../redux/actions.key_pair';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  initialize() {
  }

  onSubmit(values) {
    const { dispatch, region, routerKey, servicePath, t } = this.props;

    return new Promise((resolve, reject) => {
      const name = values.name;
      const publicKey = values.publicKey;
      const description = values.description;

      dispatch(KeyPairActions.requestCreateKeyPair(routerKey, region.regionId, {
        name,
        publicKey,
        description,
      }))
        .then(() => {
          resolve();
          setTimeout(() => {
            dispatch(push(`${servicePath}/key_pairs`));
            dispatch(notify(t('createSuccessed')));
          }, 200);
        }).catch((error) => {
          dispatch(notifyAlert(error.displayMsg || error.message));
          reject();
        });
    });
  }

  render() {
    const { t } = this.props;
    const keyPairDownloadUrl = this.props.context.keyPair && this.props.context.keyPair.privateKey;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{t('pageKeyPairCreate.createKeyPair')}</span>
              </div>
            </div>
            <KeyPairForm onSubmit={this.onSubmit} />
            <iframe className="hide" src={keyPairDownloadUrl} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
