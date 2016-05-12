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
      const opKeystoneEndpoint = values.opKeystoneEndpoint;
      const opAdminName = values.opAdminName;
      const opAdminPassword = values.opAdminPassword;

      dispatch(RegionActions.requestCreateRegion({
        regionId,
        name,
        opKeystoneEndpoint,
        opAdminName,
        opAdminPassword,
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
              <li className="active">{t('add')}</li>
            </ol>
            <hr />
            <RegionForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
