import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import EipForm from '../forms/EipForm';
import * as EipActions from '../redux/actions.eip';

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
      const count = Number(values.count);

      dispatch(EipActions.requestCreateEip(routerKey, region.regionId, {
        name,
        count,
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
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span>{t('pageEipCreate.createEip')}</span>
              </div>
            </div>
            <EipForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
