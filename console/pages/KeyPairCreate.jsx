import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import KeyPairForm from '../forms/KeyPairForm';
import * as KeyPairActions from '../redux/actions.key_pair';

class C extends Page {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
  }

  onSubmit(values) {
    const { dispatch, region, routerKey } = this.props;

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
        }).catch((error) => {
          reject({ _error: error.message });
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
