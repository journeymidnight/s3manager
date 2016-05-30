import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import NetworkForm from '../forms/NetworkForm';
import * as Actions from '../redux/actions';
import * as NetworkActions from '../redux/actions.network';

class C extends RegionPage {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { t, dispatch, region } = this.props;
    dispatch(Actions.setHeader(t('networkManage'), `/${region.regionId}/networks`));
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
    const initialValues = {
      cidr: '192.168.0.0/24',
    };
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('create')}
            </h3>
            <hr />
            <NetworkForm onSubmit={this.onSubmit} initialValues={initialValues} />
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
