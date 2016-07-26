import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import * as RegionActions from '../redux/actions.region';

class C extends Page {

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));

    dispatch(RegionActions.requestDescribeRegions());
  }

  render() {
    const { params } = this.props;

    const regions = this.props.context.regionSet;
    if (!regions || regions.length === 0) {
      return <div />;
    }

    const regionId = params.regionId;
    let region;

    if (regionId === 'r') {
      region = regions[0];
    } else {
      region = _.find(regions, (r) => { return r.regionId === regionId; });
    }

    if (!region) {
      return <div />;
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <ul className="nav-links">
                {regions.map((_region) => {
                  return (
                    <li key={_region.regionId} className={(region.regionId === _region.regionId) ? 'active' : ''}>
                      <Link to={`/devops/${_region.regionId}/nodes`}>
                        {_region.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              {React.cloneElement(this.props.children, { region2: region })}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
