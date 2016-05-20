import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';

class C extends RegionPage {

  componentDidMount() {
  }

  render() {
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
