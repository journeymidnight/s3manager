import React from 'react';
import { Link } from 'react-router';
import RegionPage, { attach } from '../../shared/pages/RegionPage';

class C extends RegionPage {

  componentDidMount() {
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="well prepend-top-20">
              <div className="nothing-here-block">
                {t('noAnyAvailableRegions')}
                <Link to="/login">
                  {t('relogin')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
