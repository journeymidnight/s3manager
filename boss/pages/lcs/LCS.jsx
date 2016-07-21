import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';
import * as RegionActions from '../../redux/actions.region';

class C extends Page {

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('serviceManage'), '/services'));
  }

  refresh() {
    const { params, dispatch } = this.props;
    this.regionId = params.regionId;
    dispatch(RegionActions.requestDescribeRegion(this.regionId))
    .then(() => {
      this.region = this.props.context.region;
    });
  }

  render() {
    const { t, params } = this.props;

    const region = this.props.context.region || this.region;
    if (!region || region.regionId !== params.regionId) {
      this.refresh();

      return <div />;
    }

    let active = 'basic';
    if (_.endsWith(this.props.location.pathname, 'projects')) {
      active = 'projects';
    } else if (_.endsWith(this.props.location.pathname, 'images')) {
      active = 'images';
    } else if (_.endsWith(this.props.location.pathname, 'instance_types')) {
      active = 'instanceTypes';
    } else if (_.endsWith(this.props.location.pathname, 'basic')) {
      active = 'basic';
    }

    return (
      <div className="container-fluid container-limited detail">
        <div className="content">
          <div className="clearfix">

            <div className="top-area">
              <div className="nav-text">
                {t('region')}&nbsp;<i>{region.regionId}</i>
              </div>

              <ul className="nav-links pull-right">
                <li className={`pull-right ${(active === 'images') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/regions/${region.regionId}/images`}>
                    {t('pageRegion.publicImages')}
                  </Link>
                </li>
                <li className={`pull-right ${(active === 'instanceTypes') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/regions/${region.regionId}/instance_types`}>
                    {t('pageRegion.instanceTypes')}
                  </Link>
                </li>
                <li className={`pull-right ${(active === 'basic') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/services/lcs/${region.regionId}/basic`}>
                    {t('pageRegion.basic')}
                  </Link>
                </li>
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
