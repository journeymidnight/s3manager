import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';

class C extends RegionPage {

  componentDidMount() {
    this.sidebar = new window.Sidebar();

    const $ = require('jquery');
    $('.js-sidebar-toggle').click();
  }

  componentWillUnmount() {
    const $ = require('jquery');
    $('.page-with-sidebar')
    .removeClass('right-sidebar-expanded')
    .removeClass('right-sidebar-collapsed');
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="clearfix detail-page-header">
              <div className="header">
                <ul className="nav-links">
                  <li className="home active">
                    <a data-placement="right" href="#">{t('pageNetwork.subnet')}</a>
                  </li>
                  <li className="">
                    <a data-placement="right" href="#">{t('pageNetwork.router')}</a>
                  </li>
                </ul>
              </div>
            </div>
            <aside className="right-sidebar right-sidebar-collapsed">
              <div className="issuable-sidebar">
                <div className="block issuable-sidebar-header">
                  <a className="gutter-toggle pull-right js-sidebar-toggle" href="#">
                    <i className="fa fa-angle-double-left"></i>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
