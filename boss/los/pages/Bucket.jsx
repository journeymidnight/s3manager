import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Page, { attach } from '../../../shared/pages/Page';
import { Bar } from '../../../lecloud-design';

class C extends Page {

  shouldComponentUpdate(nextProps) {
    let shouldUpdate = false;
    if (nextProps.routerKey !== this.props.routerKey && _.keys(nextProps.context).length === 0) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }

  render() {
    const { t, servicePath, params, location } = this.props;

    let active = 'detail';
    if (_.endsWith(location.pathname, 'detail')) {
      active = 'detail';
    } else if (_.endsWith(location.pathname, 'objects') || _.endsWith(location.pathname, 'create')) {
      active = 'objects';
    }

    return (
      <div className="full-height">
        <Bar type="secondary">
          <div className="tab">
            <Link activeClassName={active === 'detail' ? 'tab-active' : ''} to={`/buckets/${params.bucketName}/detail?date=${this.props.location.query.date}`}>
              {t('bucketDetail')}
            </Link>
            <Link activeClassName={active === 'objects' ? 'tab-active' : ''} to={`/buckets/${params.bucketName}/objects?date=${this.props.location.query.date}`}>
              {t('objectManagement')}
            </Link>
          </div>
        </Bar>
        <div className="full-height">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default attach(C);
