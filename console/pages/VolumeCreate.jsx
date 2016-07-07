import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import VolumeForm from '../forms/VolumeForm';
import * as VolumeActions from '../redux/actions.volume';

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
      const size = Number(values.size);
      const count = Number(values.count);

      dispatch(VolumeActions.requestCreateVolume(routerKey, region.regionId, {
        name,
        size,
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
                <span>{t('pageVolumeCreate.createVolume')}</span>
              </div>
            </div>
            <VolumeForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
