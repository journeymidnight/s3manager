import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Page, { attach } from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';
import * as RegionActions from '../../redux/actions.region';

class C extends Page {

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));

    dispatch(RegionActions.requestDescribeRegions());
  }

  componentWillMount() {
    this.checkRegion(this.props);

    this.setState({
      region: undefined,
      regions: undefined,
    });
  }

  componentDidUpdate() {
    this.checkRegion(this.props);
  }

  checkRegion(props) {
    const { dispatch, params, path } = props;

    let region;
    const regions = props.context.regionSet;
    if (!regions || regions.length === 0) {
      return;
    }

    const regionId = params.regionId;

    if (regionId) {
      region = _.find(regions, (r) => { return r.regionId === regionId; });
    }

    if (!region) {
      dispatch(push(`/${path.split('/')[1]}/${path.split('/')[2]}/${regions[0].regionId}`));
    }

    this.setState({
      region,
      regions,
    });
  }

  render() {
    if (!this.state.region) {
      return <div />;
    }

    const { regions, region } = this.state;
    const { path } = this.props;

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <ul className="nav-links">
                {regions.map((_region) => {
                  return (
                    <li key={_region.regionId} className={(region.regionId === _region.regionId) ? 'active' : ''}>
                      <Link to={`/${path.split('/')[1]}/${path.split('/')[2]}/${_region.regionId}`}>
                        {_region.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              {this.props.children && React.cloneElement(this.props.children, { region2: region })}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
