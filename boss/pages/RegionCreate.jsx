import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import RegionForm from '../forms/RegionForm';
import * as RegionActions from '../redux/actions.region';

class C extends Page {

  componentDidMount() {
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const regionId = values.regionId;
      const name = values.name;
      const publicEndpoint = values.publicEndpoint;
      const manageEndpoint = values.manageEndpoint;
      const manageKey = values.manageKey;
      const manageSecret = values.manageSecret;

      dispatch(RegionActions.requestCreateRegion({
        regionId,
        name,
        publicEndpoint,
        manageEndpoint,
        manageKey,
        manageSecret,
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
            <ol className="breadcrumb">
              <li><Link to="/regions">{t('regionManage')}</Link></li>
              <li className="active">{t('create')}</li>
            </ol>
            <RegionForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
