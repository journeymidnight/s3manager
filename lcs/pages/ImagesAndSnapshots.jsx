import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Page, { attach } from '../../shared/pages/Page';

class C extends Page {

  initialize() {
  }

  shouldComponentUpdate(nextProps) {
    let shouleUpdate = false;

    if (nextProps.routerKey !== this.props.routerKey && _.keys(nextProps.context).length === 0) {
      shouleUpdate = true;
    }

    return shouleUpdate;
  }

  render() {
    const { t, servicePath } = this.props;

    let active = '';
    if (_.endsWith(this.props.location.pathname, 'public_images')) {
      active = 'public_images';
    } else if (_.endsWith(this.props.location.pathname, 'private_images')) {
      active = 'private_images';
    } else if (_.endsWith(this.props.location.pathname, 'volume_snapshots')) {
      active = 'volume_snapshots';
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            {!!active && <ul className="nav-links clearfix">
              <li className={`pull-left ${(active === 'public_images') ? 'active' : ''}`}>
                <Link data-placement="left" to={`${servicePath}/images_snapshots/public_images`}>
                  {t('public_images')}
                </Link>
              </li>
              <li className={`pull-left ${(active === 'private_images') ? 'active' : ''}`}>
                <Link data-placement="left" to={`${servicePath}/images_snapshots/private_images`}>
                  {t('private_images')}
                </Link>
              </li>
              {/* <li className={`pull-left ${(active === 'volume_snapshots') ? 'active' : ''}`}>
                <Link data-placement="left" to={`${servicePath}/images_snapshots/volume_snapshots`}>
                  {t('volume_snapshots')}
                </Link>
              </li>*/}
            </ul>}
            <div>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
