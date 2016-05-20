import React from 'react';
import { Link } from 'react-router';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import NetworkForm from '../forms/NetworkForm';
import * as NetworkActions from '../redux/actions.network';

class C extends RegionPage {

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
      const cidr = values.cidr;

      dispatch(NetworkActions.requestCreateNetwork(routerKey, region.regionId, {
        name,
        cidr,
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
              <li><Link to={`/${this.props.region.regionId}/networks`}>{t('networkManage')}</Link></li>
              <li className="active">{t('add')}</li>
            </ol>
            <NetworkForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
