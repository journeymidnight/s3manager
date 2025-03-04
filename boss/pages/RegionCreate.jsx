import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as RegionActions from '../redux/actions.region';
import * as Actions from '../redux/actions';
import RegionForm from '../forms/RegionForm';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const regionId = values.regionId;
      const name = values.name;
      const devopsEndpoint = values.devopsEndpoint;
      const consoleEndpoint = values.consoleEndpoint;

      dispatch(RegionActions.requestCreateRegion({
        regionId,
        name,
        devopsEndpoint,
        consoleEndpoint,
      }))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
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
                <span>{t('create') + t('region')}</span>
              </div>
            </div>

            <RegionForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
