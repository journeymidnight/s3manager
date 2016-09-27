import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Page, { attach } from '../../shared/pages/Page';
import * as BucketActions from '../redux/actions.bucket';

class C extends Page {

  shouldComponentUpdate(nextProps) {
    let shouldUpdate = false;
    if (nextProps.routerKey !== this.props.routerKey && _.keys(nextProps.context).length === 0) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(BucketActions.removeBucket());
  }

  render() {
    const { t, servicePath, params, location } = this.props;

    let active = 'detail';
    if (_.endsWith(location.pathname, 'detail')) {
      active = 'detail';
    } else if (_.endsWith(location.pathname, 'objects')) {
      active = 'objects';
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <ul className="nav-links clearfix">
              <li className={`pull-left ${(active === 'detail') ? 'active' : ''}`}>
                <Link data-placement="left" to={`${servicePath}/buckets/${params.bucketName}/detail`}>
                  {t('bucketDetail')}
                </Link>
              </li>
              <li className={`pull-left ${(active === 'objects') ? 'active' : ''}`}>
                <Link data-placement="left" to={`${servicePath}/buckets/${params.bucketName}/objects`}>
                  {t('objectManagement')}
                </Link>
              </li>
            </ul>
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
