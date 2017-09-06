import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import * as RegionActions from '../redux/actions.region';

class C extends Page {

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));
  }

  refresh() {
    const { params, dispatch } = this.props;
    dispatch(RegionActions.requestDescribeRegion(params.regionId))
  }

  render() {
    const { t, params } = this.props;

    const region = this.props.context.region;
    if (!region || region.regionId !== params.regionId) {
      this.refresh();

      return <div />;
    }

    let active = 'basic';
    if (_.endsWith(this.props.location.pathname, 'basic')) {
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
                <li className={`pull-right ${(active === 'basic') ? 'active' : ''}`}>
                  <Link data-placement="left" to={`/regions/${region.regionId}/basic`}>
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
